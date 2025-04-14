import { db } from "../db";
import { eq } from "drizzle-orm";
import {
  type InsertRecipe,
  recipeTable,
  tempRecipes,
} from "../db/schemas/recipe-schema.ts";

export const upsertRecipe = async (recipe: InsertRecipe) => {
  try {
    return await db
      .insert(recipeTable)
      .values(recipe)
      .onConflictDoUpdate({
        target: [recipeTable.id, recipeTable.name],
        set: recipe,
      });
  } catch (error) {
    console.log("Error upserting recipe:", error);
    throw error;
  }
};

export const updateRecipe = async (recipe: InsertRecipe) => {
  try {
    await db
      .update(recipeTable)
      .set(recipe)
      .where(eq(recipeTable.name, "Dan"))
      .returning({ updatedId: recipeTable.id });
  } catch (error) {
    console.log("Error updating recipe:", error);
  }
};

export const insertTempRecipes = () => {
  return db.insert(recipeTable).values(tempRecipes).returning();
};