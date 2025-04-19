import { db } from "../db";
import { and, eq } from "drizzle-orm";
import {
  groceryListTable,
  type InsertGroceryList,
} from "../db/schemas/grocery-list-schema.ts";

// TODO: fix/test
export const upsertGroceryList = async (groceryList: InsertGroceryList) => {
  try {
    // TODO: transaction
    return await db.insert(groceryListTable).values(groceryList).returning();
    // TODO: upsert grocery list ingredients
  } catch (error) {
    console.log("Error upserting groceryList:", error);
    throw error;
  }
};

export const getAllGroceryLists = async (userId: number) => {
  try {
    return await db
      .select()
      .from(groceryListTable)
      .where(eq(groceryListTable.userId, userId));
  } catch (error) {
    console.log("Error getting groceryList:", error);
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
    console.log("Error getting groceryList:", error);
  }
};