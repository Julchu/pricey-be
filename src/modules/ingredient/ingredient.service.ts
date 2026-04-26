import { db } from "../../db";
import {
  ingredientTable,
  type InsertIngredient,
  type InsertPublicIngredient,
} from "../../db/schemas/ingredient.schema";
import { and, eq } from "drizzle-orm";

export const upsertIngredient = async (
  ingredient: Omit<InsertPublicIngredient, "userId">,
  userId: number,
) => {
  const insertIngredient: InsertIngredient = {
    ...ingredient,
    name: ingredient.name.toLowerCase(),
    userId,
  };

  // TODO: add default values when upserting ingredient
  // TODO: fix req.body.ingredient type; passing string in insertIngredient.quantity works, but not int
  // Ex: this doesn't work: { quantity: ingredient.quantity || 1 }
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
    throw new Error("Error getting list of all ingredients:", { cause: error });
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
    throw new Error("Error getting specific ingredient:", { cause: error });
  }
};

export const getIngredientIdByPublicId = async (
  publicId: string,
  userId: number,
) => {
  try {
    const [ingredient] = await db
      .select({ id: ingredientTable.id })
      .from(ingredientTable)
      .where(
        and(
          eq(ingredientTable.publicId, publicId),
          eq(ingredientTable.userId, userId),
        ),
      );
    return ingredient?.id ?? null;
  } catch (error) {
    throw new Error("Error getting ingredient by public ID:", { cause: error });
  }
};