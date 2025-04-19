import { db } from "../db";
import {
  ingredientTable,
  type InsertIngredient,
} from "../db/schemas/ingredient-schema.ts";
import { and, eq } from "drizzle-orm";

export const upsertIngredient = async (ingredient: InsertIngredient) => {
  try {
    return await db
      .insert(ingredientTable)
      .values(ingredient)
      .onConflictDoUpdate({
        target: [ingredientTable.userId, ingredientTable.name],
        set: ingredient,
      })
      .returning();
  } catch (error) {
    console.log("Error upserting ingredient:", error);
    throw error;
  }
};

export const getAllIngredients = async (userId: number) => {
  try {
    return await db
      .select()
      .from(ingredientTable)
      .where(eq(ingredientTable.userId, userId));
  } catch (error) {
    console.log("Error getting groceryList:", error);
  }
};

export const getIngredient = async (ingredientId: number, userId: number) => {
  try {
    return await db
      .select()
      .from(ingredientTable)
      .where(
        and(
          eq(ingredientTable.id, ingredientId),
          eq(ingredientTable.userId, userId),
        ),
      );
  } catch (error) {
    console.log("Error getting groceryList:", error);
  }
};