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

    // rows.reduce<GroceryList[]>(
    //   (groceryLists, { grocery_lists, grocery_list_ingredients }) => {
    //
    //     groceryLists.push();
    //     return groceryLists;
    //   },
    //   [],
    // );
    //
    // return rows;

    const results = rows.reduce<Record<string, GroceryList>>(
      (groceryLists, { grocery_lists, grocery_list_ingredients }) => {
        const {
          userId: _userId,
          id: _id,
          ...publicGroceryList
        } = grocery_lists;

        const groceryList: GroceryList = {
          ...publicGroceryList,
          ingredients: [],
        };

        const groceryListPublicId = grocery_lists.publicId;

        if (!groceryLists[groceryListPublicId])
          groceryLists[groceryListPublicId] = groceryList;

        if (grocery_list_ingredients) {
          const {
            id: _ingredientId,
            groceryListId,
            ...ingredient
          } = grocery_list_ingredients;

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

    const {
      userId: _userId,
      id: _groceryListId,
      ...publicGroceryList
    } = fetchedGroceryList;

    const ingredients = await db
      .select()
      .from(groceryListIngredientTable)
      .where(eq(groceryListIngredientTable.groceryListId, _groceryListId));

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
export const insertGroceryList = async (
  groceryList: InsertPublicGroceryList,
  groceryListIngredients: InsertPublicGroceryListIngredient[] = [],
  userId: number,
) => {
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
      } else {
        console.error(
          `Error inserting grocery list ingredients for ${groceryListId}`,
        );
      }
      return insertedGroceryList;
    });
  } catch (error) {
    throw new Error("Error inserting grocery list", { cause: error });
  }
};

// Note: how to account for updated ingredient list?
// Would need to diff groceryList ingredients and remove unused ingredients?
// Because of cascading deletion, can just delete original table before inserting new one
export const updateGroceryList = async (
  groceryList: InsertGroceryList,
  groceryListIngredients: InsertPublicGroceryListIngredient[],
  userId: number,
) => {
  try {
    // return await db.transaction(async (tx) => {
    // if (groceryList.publicId) {
    //   await tx
    //     .delete(groceryListTable)
    //     .where(
    //       and(
    //         eq(groceryListTable.publicId, groceryList.publicId),
    //         eq(groceryListTable.userId, userId),
    //       ),
    //     );
    //
    //   await tx
    //     .delete(groceryListIngredientTable)
    //     .where(
    //       eq(groceryListIngredientTable.groceryListId, groceryList.publicId),
    //     );
    // const insertedGroceryList = await tx
    //   .insert(groceryListTable)
    //   .values(insertGroceryList)
    //   .onConflictDoUpdate({
    //     target: [
    //       groceryListTable.userId,
    //       groceryListTable.name,
    //       groceryListTable.id,
    //     ],
    //     set: insertGroceryList,
    //   })
    //   .returning();
    // }
    // await tx.insert(groceryListTable).values(groceryList).returning();
    // for (const ingredient of groceryListIngredients) {
    //   await tx.update(groceryListIngredientTable).set(ingredient).returning();
    // }
    // });
    //   TODO: update grocery list ingredients
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