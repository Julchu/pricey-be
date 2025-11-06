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
export const upsertGroceryList = async (
  groceryList: Omit<InsertGroceryList, "userId">,
  groceryIngredients: Omit<InsertGroceryListIngredient, "userId">[] = [],
  userId: string,
) => {
  const insertGroceryList: InsertGroceryList = {
    ...groceryList,
    name: groceryList.name.toLowerCase(),
    userId,
  };

  const insertGroceryListIngredients: InsertGroceryListIngredient[] =
    groceryIngredients.map((list) => {
      return {
        ...list,
        name: list.name.toLowerCase(),
        userId,
        quantity: list.quantity || 1,
      };
    });

  try {
    return await db.transaction(async (tx) => {
      const insertedGroceryList = await tx
        .insert(groceryListTable)
        .values(insertGroceryList)
        .onConflictDoUpdate({
          target: [groceryListTable.userId, groceryListTable.name],
          set: insertGroceryList,
        })
        .returning();

      // TODO: check commented code
      await tx
        .update(groceryListTable)
        .set({
          name: "Cheese",
        })
        .where(eq(groceryListTable.name, "banana"))
        .returning();
      // const insertedGroceryListIngredients = await tx
      //   .insert(groceryListIngredientTable)
      //   .values(insertGroceryListIngredients)
      //   .returning();

      return {
        insertedGroceryList: insertedGroceryList[0],
        // ingredients: insertedGroceryListIngredients,
      };
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

export const getAllGroceryLists = async (userId: string) => {
  try {
    return await db
      .select()
      .from(groceryListTable)
      .where(eq(groceryListTable.userId, userId));
  } catch (error) {
    throw new Error("Error getting grocery list", { cause: error });
  }
};

export const getGroceryList = async (groceryListId: string, userId: string) => {
  try {
    return await db
      .select()
      .from(groceryListTable)
      .where(
        and(
          eq(groceryListTable.publicId, groceryListId),
          eq(groceryListTable.userId, userId),
        ),
      );
  } catch (error) {
    throw new Error("Error getting groceryList:", { cause: error });
  }
};