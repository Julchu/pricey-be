import { db } from "../db";
import { type InsertRecipe, recipeTable } from "../db/schemas/recipe-schema.ts";
import { and, eq } from "drizzle-orm";
import {
  type InsertRecipeIngredient,
  recipeIngredientTable,
} from "../db/schemas/recipe-ingredient-schema.ts";

export const upsertRecipe = async (
  recipe: InsertRecipe,
  recipeIngredients: InsertRecipeIngredient,
) => {
  try {
    // TODO: transaction
    return await db.transaction(async (tx) => {
      await tx.insert(recipeTable).values(recipe).returning();
      await tx
        .insert(recipeIngredientTable)
        .values(recipeIngredients)
        .returning();
      // TODO: upsert grocery list ingredients
    });
  } catch (error) {
    console.log("Error upserting recipe:", error);
    throw error;
  }
};

export const getAllRecipes = async (userId: number) => {
  try {
    return await db
      .select()
      .from(recipeTable)
      .where(eq(recipeTable.userId, userId));
  } catch (error) {
    console.log("Error getting recipe:", error);
  }
};

export const getRecipe = async (recipeId: number, userId: number) => {
  try {
    return await db
      .select()
      .from(recipeTable)
      .where(and(eq(recipeTable.id, recipeId), eq(recipeTable.userId, userId)));
  } catch (error) {
    console.log("Error getting recipe:", error);
  }
};

// TODO: test delete cascading for groceries/recipes, users (does it remove itself from other tables)
export const deleteRecipe = async (recipeId: number, userId: number) => {
  return;
};