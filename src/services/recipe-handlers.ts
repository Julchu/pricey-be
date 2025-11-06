import { db } from "../db";
import { type InsertRecipe, recipeTable } from "../db/schemas/recipe-schema.ts";
import { and, eq } from "drizzle-orm";
import {
  type InsertRecipeIngredient,
  recipeIngredientTable,
} from "../db/schemas/recipe-ingredient-schema.ts";

export const upsertRecipe = async (
  recipe: InsertRecipe,
  recipeIngredients: InsertRecipeIngredient[],
) => {
  if (recipeIngredients.some(() => {}))
    try {
      return await db.transaction(async (tx) => {
        await tx.insert(recipeTable).values(recipe).returning();
        await tx
          .insert(recipeIngredientTable)
          .values(recipeIngredients)
          .returning();
      });
    } catch (error) {
      throw new Error("Error upserting recipe:", { cause: error });
    }
};

export const getAllRecipes = async (userId: string) => {
  try {
    return await db
      .select()
      .from(recipeTable)
      .where(eq(recipeTable.userId, userId));
  } catch (error) {
    throw new Error("Error getting recipe:", { cause: error });
  }
};

export const getRecipe = async (recipeId: string, userId: string) => {
  try {
    return await db
      .select()
      .from(recipeTable)
      .where(
        and(eq(recipeTable.publicId, recipeId), eq(recipeTable.userId, userId)),
      );
  } catch (error) {
    throw new Error("Error getting recipe", { cause: error });
  }
};

// TODO: test delete cascading for groceries/recipes, users (does it remove itself from other tables)
export const deleteRecipe = async (recipeId: string, userId: string) => {
  return;
};