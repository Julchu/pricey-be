import { db } from "../db";
import {
  ingredientTable,
  type InsertIngredient,
} from "../db/schemas/ingredient-schema.ts";
import { and, eq } from "drizzle-orm";

export const upsertIngredient = async (
  ingredient: Omit<InsertIngredient, "userId">,
  userId: number,
) => {
  const insertIngredient: InsertIngredient = {
    ...ingredient,
    name: ingredient.name.toLowerCase(),
    userId,
  };
  // TODO: test upserting ingredient
  try {
    return await db
      .insert(ingredientTable)
      .values(insertIngredient)
      .onConflictDoUpdate({
        target: [ingredientTable.userId, ingredientTable.name],
        set: ingredient,
      })
      .returning();
  } catch (error) {
    throw new Error("Error upserting ingredient:", { cause: error });
  }
};

export const getAllIngredients = async (userId: number) => {
  try {
    return await db
      .select()
      .from(ingredientTable)
      .where(eq(ingredientTable.userId, userId));
  } catch (error) {
    throw new Error("Error getting groceryList:", { cause: error });
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
    throw new Error("Error getting groceryList:", { cause: error });
  }
};