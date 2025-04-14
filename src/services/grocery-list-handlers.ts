import { db } from "../db";
import { eq } from "drizzle-orm";
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

export const insertTempGroceryLists = () => {
  return db.insert(groceryListTable).values(tempGroceryLists).returning();
};