import { db } from "../db";
import { and, eq } from "drizzle-orm";
import {
  groceryListTable,
  type InsertGroceryList,
  tempGroceryLists,
} from "../db/schemas/grocery-list-schema.ts";

// TODO: fix/test
export const upsertGroceryList = async (groceryList: InsertGroceryList) => {
  try {
    return await db.insert(groceryListTable).values(groceryList).returning();
  } catch (error) {
    console.log("Error upserting groceryList:", error);
    throw error;
  }
};

// TODO
export const getAllGroceryLists = async (id: string) => {
  return id;
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

export const insertTempGroceryLists = async () => {
  try {
    return await db
      .insert(groceryListTable)
      .values(tempGroceryLists)
      .returning();
  } catch (error) {
    console.log("Error inserting temp grocery lists:", error);
  }
};