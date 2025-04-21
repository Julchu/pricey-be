import { db } from "../db";
import { and, eq } from "drizzle-orm";
import {
  groceryListTable,
  type InsertGroceryList,
} from "../db/schemas/grocery-list-schema.ts";
import {
  groceryListIngredientTable,
  type InsertGroceryListIngredient,
} from "../db/schemas/grocery-ingredient-schema.ts";

// TODO: determine if upsert vs insert/update & removing schema unique conflict
// TODO: test if insert accounts for uniqueness (can insert same name/list/userId ingredient, or if blocked)
export const insertGroceryList = async (
  groceryList: InsertGroceryList,
  groceryIngredients: InsertGroceryListIngredient[],
) => {
  try {
    return await db.transaction(async (tx) => {
      await tx.insert(groceryListTable).values(groceryList).returning();
      await tx
        .insert(groceryListIngredientTable)
        .values(groceryIngredients)
        .returning();
    });
  } catch (error) {
    throw new Error("Error inserting grocery list", { cause: error });
  }
};

export const updateGroceryList = async (
  groceryList: InsertGroceryList,
  groceryIngredients: InsertGroceryListIngredient[],
) => {
  try {
    return await db.transaction(async (tx) => {
      await tx.insert(groceryListTable).values(groceryList).returning();
      for (const ingredient of groceryIngredients) {
        await tx.update(groceryListIngredientTable).set(ingredient).returning();
      }
    });
  } catch (error) {
    throw new Error("Error updating grocery list", { cause: error });
  }
};

export const getAllGroceryLists = async (userId: number) => {
  try {
    return await db
      .select()
      .from(groceryListTable)
      .where(eq(groceryListTable.userId, userId));
  } catch (error) {
    throw new Error("Error getting grocery list", { cause: error });
  }
};

export const getGroceryList = async (groceryListId: number, userId: number) => {
  try {
    return await db
      .select()
      .from(groceryListTable)
      .where(
        and(
          eq(groceryListTable.id, groceryListId),
          eq(groceryListTable.userId, userId),
        ),
      );
  } catch (error) {
    throw new Error("Error getting groceryList:", { cause: error });
  }
};