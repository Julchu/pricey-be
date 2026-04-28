import { db } from "../../db";
import { and, eq, inArray } from "drizzle-orm";
import {
  groceryListTable,
  type InsertGroceryList,
  type InsertPublicGroceryList,
} from "../../db/schemas/grocery-list.schema";
import {
  groceryListIngredientTable,
  type InsertGroceryListIngredient,
  type InsertPublicGroceryListIngredient,
} from "../../db/schemas/grocery-list-ingredient.schema";
import { ingredientTable } from "../../db/schemas/ingredient.schema";
import type { GroceryList } from "../../types";

export const getAllGroceryLists = async (userId: number) => {
  try {
    const rows = await db
      .select()
      .from(groceryListTable)
      .leftJoin(
        groceryListIngredientTable,
        eq(groceryListIngredientTable.groceryListId, groceryListTable.id),
      )
      .leftJoin(
        ingredientTable,
        eq(ingredientTable.id, groceryListIngredientTable.ingredientId),
      )
      .where(eq(groceryListTable.userId, userId));

    const results = rows.reduce<Record<string, GroceryList>>(
      (
        groceryListsObject,
        {
          grocery_lists: currentList,
          grocery_list_ingredients: groceryListIngredient,
          ingredients: currentIngredient,
        },
      ) => {
        const groceryListPublicId = currentList.publicId;

        if (!groceryListsObject[groceryListPublicId]) {
          const { updatedAt, createdAt, deletedAt, publicId, name } =
            currentList;

          groceryListsObject[groceryListPublicId] = {
            updatedAt,
            createdAt,
            deletedAt,
            publicId,
            name,
            isPublic: currentList.isPublic,
            ingredients: [],
          };
        }

        if (groceryListIngredient) {
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
          } = groceryListIngredient;

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

          groceryListsObject[groceryListPublicId].ingredients.push(ingredient);
        }

        return groceryListsObject;
      },
      {},
    );
    return Object.values(results);
  } catch (error) {
    throw new Error("Error getting grocery list", { cause: error });
  }
};

export const getGroceryList = async (groceryListId: string, userId: number) => {
  try {
    const [fetchedGroceryList] = await db
      .select()
      .from(groceryListTable)
      .where(
        and(
          eq(groceryListTable.publicId, groceryListId),
          eq(groceryListTable.userId, userId),
        ),
      );

    if (!fetchedGroceryList) return null;

    const { updatedAt, createdAt, deletedAt, publicId, name } =
      fetchedGroceryList;

    const publicGroceryList = {
      updatedAt,
      createdAt,
      deletedAt,
      publicId,
      name,
      isPublic: fetchedGroceryList.isPublic,
    };

    const ingredientRows = await db
      .select()
      .from(groceryListIngredientTable)
      .leftJoin(
        ingredientTable,
        eq(ingredientTable.id, groceryListIngredientTable.ingredientId),
      )
      .where(
        eq(groceryListIngredientTable.groceryListId, fetchedGroceryList.id),
      );

    const ingredients = ingredientRows.map(
      ({ grocery_list_ingredients: groceryListIngredients, ingredients }) => {
        const { publicId, name, capacity, quantity, unit, image } =
          groceryListIngredients;
        return {
          publicId,
          name,
          capacity,
          quantity,
          unit,
          image,
          ingredientPublicId: ingredients?.publicId ?? null,
        };
      },
    );

    const groceryList: GroceryList = {
      ...publicGroceryList,
      ingredients,
    };

    return groceryList;
  } catch (error) {
    throw new Error("Error getting groceryList:", { cause: error });
  }
};

// TODO: omit private fields on return
// TODO: determine if upsert vs insert/update & removing schema unique conflict
// TODO: test insert accounts for uniqueness (can insert same name/list/userId ingredient, or if blocked)
// TODO: insert ingredient might have ingredient public id; get ingredient private id to associate to fk
export const insertGroceryList = async ({
  groceryList,
  groceryListIngredients = [],
  userId,
}: {
  groceryList: InsertPublicGroceryList;
  groceryListIngredients: InsertPublicGroceryListIngredient[];
  userId: number;
}) => {
  const insertGroceryList: InsertGroceryList = {
    ...groceryList,
    name: groceryList.name.toLowerCase(),
    userId,
  };

  const ingredientPublicIds = groceryListIngredients
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

      const [insertedGroceryList] = await tx
        .insert(groceryListTable)
        .values(insertGroceryList)
        .onConflictDoUpdate({
          target: [groceryListTable.userId, groceryListTable.name],
          set: insertGroceryList,
        })
        .returning();

      const groceryListId = insertedGroceryList?.id;

      if (groceryListId && groceryListIngredients.length > 0) {
        const insertGroceryListIngredients: InsertGroceryListIngredient[] =
          groceryListIngredients.map((ingredient) => {
            return {
              ...ingredient,
              name: ingredient.name,
              quantity: ingredient.quantity || 1,
              groceryListId,
              ingredientId: ingredient.ingredientPublicId
                ? (ingredientIdMap[ingredient.ingredientPublicId] ?? null)
                : null,
            };
          });

        const insertedGroceryListIngredients = await tx
          .insert(groceryListIngredientTable)
          .values(insertGroceryListIngredients)
          .returning();

        return {
          ...insertedGroceryList,
          ingredients: insertedGroceryListIngredients,
        };
      }
      return insertedGroceryList;
    });
  } catch (error) {
    throw new Error("Error inserting grocery list", { cause: error });
  }
};

export const updateGroceryList = async ({
  groceryListPublicId,
  groceryList,
  deletedIngredientIds,
  newIngredients,
  updatedIngredients,
  userId,
}: {
  groceryListPublicId: string;
  groceryList: InsertPublicGroceryList;
  deletedIngredientIds: string[];
  newIngredients: InsertPublicGroceryListIngredient[];
  updatedIngredients: InsertPublicGroceryListIngredient[];
  userId: number;
}) => {
  if (!groceryListPublicId) return;

  const ingredientPublicIds = [
    ...newIngredients.map(({ ingredientPublicId }) => ingredientPublicId),
    ...updatedIngredients.map(({ ingredientPublicId }) => ingredientPublicId),
  ].filter((id): id is string => !!id);

  try {
    return await db.transaction(async (tx) => {
      const [updatedGroceryList] = await tx
        .update(groceryListTable)
        .set({ name: groceryList.name, isPublic: groceryList.isPublic })
        .where(
          and(
            eq(groceryListTable.publicId, groceryListPublicId),
            eq(groceryListTable.userId, userId),
          ),
        )
        .returning();

      if (!updatedGroceryList) {
        throw new Error("Grocery list not found");
      }
      const groceryListId = updatedGroceryList.id;

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
            .update(groceryListIngredientTable)
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
                eq(groceryListIngredientTable.publicId, ingredient.publicId),
                eq(groceryListIngredientTable.groceryListId, groceryListId),
              ),
            );
        }
      }

      const insertGroceryListIngredients: InsertGroceryListIngredient[] =
        newIngredients.map((ingredient) => {
          return {
            ...ingredient,
            name: ingredient.name,
            quantity: ingredient.quantity || 1,
            groceryListId,
            ingredientId: ingredient.ingredientPublicId
              ? (ingredientIdMap[ingredient.ingredientPublicId] ?? null)
              : null,
          };
        });

      if (insertGroceryListIngredients.length > 0) {
        await tx
          .insert(groceryListIngredientTable)
          .values(insertGroceryListIngredients);
      }

      if (deletedIngredientIds.length > 0) {
        await tx
          .delete(groceryListIngredientTable)
          .where(
            and(
              eq(groceryListIngredientTable.groceryListId, groceryListId),
              inArray(
                groceryListIngredientTable.publicId,
                deletedIngredientIds,
              ),
            ),
          );
      }

      const sourceOfTruthIngredients = await tx
        .select()
        .from(groceryListIngredientTable)
        .where(
          eq(groceryListIngredientTable.groceryListId, updatedGroceryList.id),
        );

      return {
        ...updatedGroceryList,
        ingredients: sourceOfTruthIngredients,
      };
    });
  } catch (error) {
    throw new Error("Error updating grocery list", { cause: error });
  }
};

export const deleteGroceryList = async (
  groceryListId: string,
  userId: number,
) => {
  try {
    const [deleted] = await db
      .delete(groceryListTable)
      .where(
        and(
          eq(groceryListTable.publicId, groceryListId),
          eq(groceryListTable.userId, userId),
        ),
      )
      .returning({ publicId: groceryListTable.publicId });
    return deleted ?? null;
  } catch (error) {
    throw new Error("Error deleting grocery list", { cause: error });
  }
};