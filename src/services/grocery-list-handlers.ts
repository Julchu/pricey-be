import { db } from "../db";
import { and, eq } from "drizzle-orm";
import {
  groceryListTable,
  type InsertGroceryList,
  tempGroceryLists,
} from "../db/schemas/grocery-list-schema.ts";

export const upsertGroceryList = async (groceryList: InsertGroceryList) => {
  try {
    return await db
      .insert(groceryListTable)
      .values(groceryList)
      .onConflictDoUpdate({
        target: [groceryListTable.id, groceryListTable.name],
        set: groceryList,
      });
  } catch (error) {
    console.log("Error upserting groceryList:", error);
    throw error;
  }
};

export const getGroceryList = async (id: number) => {
  try {
    return await db
      .select()
      .from(groceryListTable)
      .where(
        and(eq(groceryListTable.id, id), eq(groceryListTable.name, "Dan")),
      );
  } catch (error) {
    console.log("Error getting groceryList:", error);
  }
};

export const updateGroceryList = async (groceryList: InsertGroceryList) => {
  try {
    await db
      .update(groceryListTable)
      .set(groceryList)
      .where(eq(groceryListTable.name, "Dan"))
      .returning({ updatedId: groceryListTable.id });
  } catch (error) {
    console.log("Error updating groceryList:", error);
  }
};

export const insertTempGroceryLists = async () => {
  try {
    return await db
      .insert(groceryListTable)
      .values(tempGroceryLists)
      .returning();
  } catch (error) {
    console.log("Error inserting temp grcoery lists:", error);
  }
};