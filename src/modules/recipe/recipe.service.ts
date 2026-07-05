import { db } from "../../db";
import { and, eq, inArray } from "drizzle-orm";
import { type InsertPublicRecipe, type InsertRecipe, recipeTable, } from "../../db/schemas/recipe.schema";
import {
  type InsertPublicRecipeIngredient,
  type InsertRecipeIngredient,
  recipeIngredientTable,
} from "../../db/schemas/recipe-ingredient.schema";
import { ingredientTable } from "../../db/schemas/ingredient.schema";
import type { Recipe } from "../../types";
import { deleteObject, getObjectKeyFromUrl } from "../../lib/s3/s3.service.ts";
import { BucketNames } from "../../lib/s3/s3-client.ts";

export const getAllRecipes = async (userId: number) => {
  try {
    const rows = await db
      .select()
      .from(recipeTable)
      .leftJoin(
        recipeIngredientTable,
        eq(recipeIngredientTable.recipeId, recipeTable.id),
      )
      .leftJoin(
        ingredientTable,
        eq(ingredientTable.id, recipeIngredientTable.ingredientId),
      )
      .where(eq(recipeTable.userId, userId));

    const results = rows.reduce<Record<string, Recipe>>(
      (
        recipesObject,
        {
          recipes: currentRecipe,
          recipe_ingredients: recipeIngredient,
          ingredients: currentIngredient,
        },
      ) => {
        const recipePublicId = currentRecipe.publicId;

        if (!recipesObject[recipePublicId]) {
          const { updatedAt, createdAt, deletedAt, publicId, name, image } =
            currentRecipe;

          recipesObject[recipePublicId] = {
            updatedAt,
            createdAt,
            deletedAt,
            publicId,
            name,
            image,
            isPublic: currentRecipe.isPublic,
            ingredients: [],
          };
        }

        if (recipeIngredient) {
          const {
            updatedAt,
            createdAt,
            deletedAt,
            name,
            capacity,
            quantity,
            unit,
            image,
            publicId,
          } = recipeIngredient;

          const ingredient = {
            updatedAt,
            createdAt,
            deletedAt,
            name,
            ingredientPublicId: currentIngredient?.publicId,
            capacity,
            quantity,
            unit,
            image,
            publicId,
          };

          recipesObject[recipePublicId].ingredients.push(ingredient);
        }

        return recipesObject;
      },
      {},
    );
    return Object.values(results);
  } catch (error) {
    throw new Error("Error getting recipe", { cause: error });
  }
};

export const getRecipe = async (recipeId: string, userId: number) => {
  try {
    const [fetchedRecipe] = await db
      .select()
      .from(recipeTable)
      .where(
        and(eq(recipeTable.publicId, recipeId), eq(recipeTable.userId, userId)),
      );

    if (!fetchedRecipe) return null;

    const { updatedAt, createdAt, deletedAt, publicId, name, image } =
      fetchedRecipe;

    const publicRecipe = {
      updatedAt,
      createdAt,
      deletedAt,
      publicId,
      name,
      image,
      isPublic: fetchedRecipe.isPublic,
    };

    const ingredientRows = await db
      .select()
      .from(recipeIngredientTable)
      .leftJoin(
        ingredientTable,
        eq(ingredientTable.id, recipeIngredientTable.ingredientId),
      )
      .where(eq(recipeIngredientTable.recipeId, fetchedRecipe.id));

    const ingredients = ingredientRows.map((row) => {
      const ri = row.recipe_ingredients;
      return {
        publicId: ri.publicId,
        name: ri.name,
        capacity: ri.capacity,
        quantity: ri.quantity,
        unit: ri.unit,
        image: ri.image,
        ingredientPublicId: row.ingredients?.publicId ?? null,
      };
    });

    const recipe: Recipe = {
      ...publicRecipe,
      ingredients,
    };

    return recipe;
  } catch (error) {
    throw new Error("Error getting recipe", { cause: error });
  }
};

export const insertRecipe = async ({
  recipe,
  recipeIngredients = [],
  userId,
}: {
  recipe: InsertPublicRecipe;
  recipeIngredients: InsertPublicRecipeIngredient[];
  userId: number;
}) => {
  const insertRecipe: InsertRecipe = {
    ...recipe,
    name: recipe.name.toLowerCase(),
    userId,
  };

  const ingredientPublicIds = recipeIngredients
    .map(({ ingredientPublicId }) => ingredientPublicId)
    .filter((id): id is string => !!id);

  try {
    return await db.transaction(async (tx) => {
      const ingredientsFoundByPublicId =
        ingredientPublicIds.length > 0
          ? await tx
              .select({
                publicId: ingredientTable.publicId,
                id: ingredientTable.id,
              })
              .from(ingredientTable)
              .where(
                and(
                  eq(ingredientTable.userId, userId),
                  inArray(ingredientTable.publicId, ingredientPublicIds),
                ),
              )
          : [];

      const ingredientIdMap = ingredientsFoundByPublicId.reduce<
        Record<string, number>
      >((ingredientMap, { publicId, id }) => {
        ingredientMap[publicId] = id;
        return ingredientMap;
      }, {});

      const [insertedRecipe] = await tx
        .insert(recipeTable)
        .values(insertRecipe)
        .onConflictDoUpdate({
          target: [recipeTable.userId, recipeTable.name],
          set: insertRecipe,
        })
        .returning();

      const recipeId = insertedRecipe?.id;

      if (recipeId && recipeIngredients.length > 0) {
        const insertRecipeIngredients: InsertRecipeIngredient[] =
          recipeIngredients.map((ingredient) => {
            return {
              ...ingredient,
              name: ingredient.name,
              quantity: ingredient.quantity || 1,
              recipeId,
              ingredientId: ingredient.ingredientPublicId
                ? (ingredientIdMap[ingredient.ingredientPublicId] ?? null)
                : null,
            };
          });

        const insertedRecipeIngredients = await tx
          .insert(recipeIngredientTable)
          .values(insertRecipeIngredients)
          .returning();

        return {
          ...insertedRecipe,
          ingredients: insertedRecipeIngredients,
        };
      }
      return insertedRecipe;
    });
  } catch (error) {
    throw new Error("Error inserting recipe", { cause: error });
  }
};

export const updateRecipe = async ({
  recipePublicId,
  recipe,
  deletedIngredientIds,
  newIngredients,
  updatedIngredients,
  userId,
}: {
  recipePublicId: string;
  recipe: InsertPublicRecipe;
  deletedIngredientIds: string[];
  newIngredients: InsertPublicRecipeIngredient[];
  updatedIngredients: InsertPublicRecipeIngredient[];
  userId: number;
}) => {
  if (!recipePublicId) return;

  const ingredientPublicIds = [
    ...newIngredients.map(({ ingredientPublicId }) => ingredientPublicId),
    ...updatedIngredients.map(({ ingredientPublicId }) => ingredientPublicId),
  ].filter((id): id is string => !!id);

  try {
    return await db.transaction(async (tx) => {
      const [updatedRecipe] = await tx
        .update(recipeTable)
        .set({
          name: recipe.name,
          isPublic: recipe.isPublic,
          image: recipe.image,
        })
        .where(
          and(
            eq(recipeTable.publicId, recipePublicId),
            eq(recipeTable.userId, userId),
          ),
        )
        .returning();

      if (!updatedRecipe) {
        throw new Error("Recipe not found");
      }
      const recipeId = updatedRecipe.id;

      const ingredientsFoundByPublicId =
        ingredientPublicIds.length > 0
          ? await tx
              .select({
                publicId: ingredientTable.publicId,
                id: ingredientTable.id,
              })
              .from(ingredientTable)
              .where(
                and(
                  eq(ingredientTable.userId, userId),
                  inArray(ingredientTable.publicId, ingredientPublicIds),
                ),
              )
          : [];

      const ingredientIdMap = ingredientsFoundByPublicId.reduce<
        Record<string, number>
      >((ingredientMap, { publicId, id }) => {
        ingredientMap[publicId] = id;
        return ingredientMap;
      }, {});

      for (const ingredient of updatedIngredients) {
        if (ingredient.publicId) {
          await tx
            .update(recipeIngredientTable)
            .set({
              name: ingredient.name,
              ingredientId: ingredient.ingredientPublicId
                ? (ingredientIdMap[ingredient.ingredientPublicId] ?? null)
                : null,
              capacity: ingredient.capacity,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
            })
            .where(
              and(
                eq(recipeIngredientTable.publicId, ingredient.publicId),
                eq(recipeIngredientTable.recipeId, recipeId),
              ),
            );
        }
      }

      const insertRecipeIngredients: InsertRecipeIngredient[] =
        newIngredients.map((ingredient) => {
          return {
            ...ingredient,
            name: ingredient.name,
            quantity: ingredient.quantity || 1,
            recipeId,
            ingredientId: ingredient.ingredientPublicId
              ? (ingredientIdMap[ingredient.ingredientPublicId] ?? null)
              : null,
          };
        });

      if (insertRecipeIngredients.length > 0) {
        await tx.insert(recipeIngredientTable).values(insertRecipeIngredients);
      }

      if (deletedIngredientIds.length > 0) {
        await tx
          .delete(recipeIngredientTable)
          .where(
            and(
              eq(recipeIngredientTable.recipeId, recipeId),
              inArray(recipeIngredientTable.publicId, deletedIngredientIds),
            ),
          );
      }

      const sourceOfTruthIngredients = await tx
        .select()
        .from(recipeIngredientTable)
        .where(eq(recipeIngredientTable.recipeId, updatedRecipe.id));

      return {
        ...updatedRecipe,
        ingredients: sourceOfTruthIngredients,
      };
    });
  } catch (error) {
    throw new Error("Error updating recipe", { cause: error });
  }
};

export const deleteRecipe = async (recipeId: string, userId: number) => {
  try {
    const [deleted] = await db
      .delete(recipeTable)
      .where(
        and(eq(recipeTable.publicId, recipeId), eq(recipeTable.userId, userId)),
      )
      .returning({ publicId: recipeTable.publicId });
    return deleted ?? null;
  } catch (error) {
    throw new Error("Error deleting recipe", { cause: error });
  }
};

// Not full updateRecipe -- used to confirm a presigned image upload without
// requiring the client to resend the entire recipe payload.
export const updateRecipeImage = async ({
  recipePublicId,
  userId,
  image,
}: {
  recipePublicId: string;
  userId: number;
  image: string;
}) => {
  try {
    const [existing] = await db
      .select({ image: recipeTable.image })
      .from(recipeTable)
      .where(
        and(
          eq(recipeTable.publicId, recipePublicId),
          eq(recipeTable.userId, userId),
        ),
      );

    const [updatedRecipe] = await db
      .update(recipeTable)
      .set({ image })
      .where(
        and(
          eq(recipeTable.publicId, recipePublicId),
          eq(recipeTable.userId, userId),
        ),
      )
      .returning();

    if (updatedRecipe && existing?.image) {
      const oldKey = getObjectKeyFromUrl(BucketNames.RECIPES, existing.image);
      if (oldKey) await deleteObject(BucketNames.RECIPES, oldKey);
    }

    return updatedRecipe ?? null;
  } catch (error) {
    throw new Error("Error updating recipe image", { cause: error });
  }
};