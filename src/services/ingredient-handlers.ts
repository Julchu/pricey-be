import { db } from "../db";
import {
  ingredientTable,
  type InsertIngredient,
  tempIngredients,
} from "../db/schemas/ingredient-schema.ts";

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

export const insertTempIngredients = async () => {
  try {
    return await db
      .insert(ingredientTable)
      .values(tempIngredients)
      .onConflictDoNothing()
      .returning();
  } catch (error) {
    console.log("Error inserting temp ingredients:", error);
  }
};