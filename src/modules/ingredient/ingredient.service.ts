import { db } from "../../db";
import {
  ingredientTable,
  type InsertIngredient,
  type InsertPublicIngredient,
} from "../../db/schemas/ingredient.schema";
import { and, eq, getTableColumns } from "drizzle-orm";
import { deleteObject, getObjectKeyFromUrl } from "../../lib/s3/s3.service.ts";
import { BucketNames } from "../../lib/s3/s3-client.ts";

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
  // TODO: split insert and update; should include publicId, might have to update zod validator (to test)
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
  const {
    userId: _userId,
    id: _id,
    ...ingredientTableColumns
  } = getTableColumns(ingredientTable);
  try {
    return await db
      .select(ingredientTableColumns)
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

// Not get ingredient, but rather get private ingredient id
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

export const updateIngredientImage = async ({
  ingredientPublicId,
  userId,
  image,
}: {
  ingredientPublicId: string;
  userId: number;
  image: string;
}) => {
  try {
    const [existing] = await db
      .select({ image: ingredientTable.image })
      .from(ingredientTable)
      .where(
        and(
          eq(ingredientTable.publicId, ingredientPublicId),
          eq(ingredientTable.userId, userId),
        ),
      );

    const [updatedIngredient] = await db
      .update(ingredientTable)
      .set({ image })
      .where(
        and(
          eq(ingredientTable.publicId, ingredientPublicId),
          eq(ingredientTable.userId, userId),
        ),
      )
      .returning();

    if (updatedIngredient && existing?.image) {
      const oldKey = getObjectKeyFromUrl(
        BucketNames.INGREDIENTS,
        existing.image,
      );
      if (oldKey) await deleteObject(BucketNames.INGREDIENTS, oldKey);
    }

    return updatedIngredient ?? null;
  } catch (error) {
    throw new Error("Error updating ingredient image:", { cause: error });
  }
};