import { db } from "../db";
import {
  ingredientTable,
  type InsertIngredient,
  tempIngredients,
} from "../db/schemas/ingredient-schema.ts";
import { eq } from "drizzle-orm";

export const upsertIngredient = async (ingredient: InsertIngredient) => {
  try {
    return await db
      .insert(ingredientTable)
      .values(ingredient)
      .onConflictDoUpdate({
        target: [ingredientTable.id, ingredientTable.name],
        set: ingredient,
      });
  } catch (error) {
    console.log("Error upserting ingredient:", error);
    throw error;
  }
};

export const updateIngredient = async (ingredient: InsertIngredient) => {
  try {
    await db
      .update(ingredientTable)
      .set(ingredient)
      .where(eq(ingredientTable.name, "Dan"))
      .returning({ updatedId: ingredientTable.id });
  } catch (error) {
    console.log("Error updating ingredient:", error);
  }
};

export const insertTempIngredients = async () => {
  try {
    return await db.insert(ingredientTable).values(tempIngredients).returning();
  } catch (error) {
    console.log("Error inserting temp ingredients:", error);
  }
};