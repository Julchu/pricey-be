import { db } from "../db";
import { and, eq } from "drizzle-orm";
import {
  groceryListTable,
  type InsertGroceryList,
  type InsertPublicGroceryList,
} from "../db/schemas/grocery-list-schema.ts";
import {
  groceryListIngredientTable,
  type InsertGroceryListIngredient,
  type InsertPublicGroceryListIngredient,
  type SelectPublicGroceryListIngredient,
} from "../db/schemas/grocery-list-ingredient-schema.ts";
import type { GroceryList } from "../utils/interfaces.ts";

export const getAllGroceryLists = async (userId: number) => {
  try {
    const rows = await db
      .select()
      .from(groceryListTable)
      .leftJoin(
        groceryListIngredientTable,
        eq(groceryListIngredientTable.groceryListId, groceryListTable.id),
      )
      .where(eq(groceryListTable.userId, userId));

    const results = rows.reduce<Record<string, GroceryList>>(
      (groceryLists, { grocery_lists, grocery_list_ingredients }) => {
        const { updatedAt, createdAt, deletedAt, publicId, name } =
          grocery_lists;

        const groceryList: GroceryList = {
          updatedAt,
          createdAt,
          deletedAt,
          publicId,
          name,
          public: grocery_lists.public,
          ingredients: [],
        };

        const groceryListPublicId = grocery_lists.publicId;

        if (!groceryLists[groceryListPublicId])
          groceryLists[groceryListPublicId] = groceryList;

        if (grocery_list_ingredients) {
          const {
            updatedAt,
            createdAt,
            deletedAt,
            capacity,
            quantity,
            unit,
            image,
            publicId,
            name,
          } = grocery_list_ingredients;

          const ingredient: SelectPublicGroceryListIngredient = {
            updatedAt,
            createdAt,
            deletedAt,
            capacity,
            quantity,
            unit,
            image,
            publicId,
            name,
          };

          groceryLists[groceryListPublicId].ingredients.push(ingredient);
        }

        return groceryLists;
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
      public: fetchedGroceryList.public,
    };

    const ingredients = await db
      .select()
      .from(groceryListIngredientTable)
      .where(
        eq(groceryListIngredientTable.groceryListId, fetchedGroceryList.id),
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

  try {
    return await db.transaction(async (tx) => {
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
              name: ingredient.name.toLowerCase(),
              quantity: ingredient.quantity || 1,
              groceryListId,
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
  groceryList,
  deletedIngredientIds,
  newIngredients,
  updatedIngredients,
  userId,
}: {
  groceryList: InsertPublicGroceryList;
  deletedIngredientIds: string[];
  newIngredients: InsertPublicGroceryListIngredient[];
  updatedIngredients: InsertPublicGroceryListIngredient[];
  userId: number;
}) => {
  try {
    return await db.transaction(async (tx) => {
      if (!groceryList.publicId) return;

      // Would fail if grocery list name already exists for user
      const [updatedGroceryList] = await tx
        .update(groceryListTable)
        .set({ name: groceryList.name, public: groceryList.public })
        .where(
          and(
            eq(groceryListTable.publicId, groceryList.publicId),
            eq(groceryListTable.userId, userId),
          ),
        )
        .returning();

      if (!updatedGroceryList) return tx.rollback();

      const groceryListId = updatedGroceryList.id;

      for (const ingredientId of deletedIngredientIds) {
        await tx
          .delete(groceryListIngredientTable)
          .where(
            and(
              eq(groceryListIngredientTable.publicId, ingredientId),
              eq(groceryListIngredientTable.groceryListId, groceryListId),
            ),
          );
      }

      for (const ingredient of updatedIngredients) {
        if (ingredient.publicId) {
          await tx
            .update(groceryListIngredientTable)
            .set({
              name: ingredient.name,
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
            name: ingredient.name.toLowerCase(),
            quantity: ingredient.quantity || 1,
            groceryListId,
          };
        });

      if (insertGroceryListIngredients.length > 0) {
        await tx
          .insert(groceryListIngredientTable)
          .values(insertGroceryListIngredients);
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
    const [deletedGroceryListId] = await db.transaction(async (tx) => {
      return tx
        .delete(groceryListTable)
        .where(
          and(
            eq(groceryListTable.publicId, groceryListId),
            eq(groceryListTable.userId, userId),
          ),
        )
        .returning({ publicId: groceryListTable.publicId });
    });
    return deletedGroceryListId;
  } catch (error) {
    throw new Error("Error deleting grocery list", { cause: error });
  }
};