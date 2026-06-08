import { db } from "../../db";
import { and, eq, inArray } from "drizzle-orm";
import {
  type InsertPantryIngredient,
  type InsertPublicPantryIngredient,
  pantryIngredientTable,
  type SelectPublicPantryIngredient,
} from "../../db/schemas/pantry-ingredient.schema.ts";
import { ingredientTable } from "../../db/schemas/ingredient.schema";

export const getPantry = async (userId: number) => {
  try {
    const rows = await db
      .select()
      .from(pantryIngredientTable)
      .leftJoin(
        ingredientTable,
        eq(ingredientTable.id, pantryIngredientTable.ingredientId),
      )
      .where(eq(pantryIngredientTable.userId, userId));

    const ingredients: SelectPublicPantryIngredient[] = rows.map(
      ({ pantry_ingredients: pi, ingredients: ing }) => ({
        updatedAt: pi.updatedAt,
        createdAt: pi.createdAt,
        deletedAt: pi.deletedAt,
        publicId: pi.publicId,
        capacity: pi.capacity,
        quantity: pi.quantity,
        unit: pi.unit,
        // name and image come from the master ingredient row
        name: ing?.name ?? "",
        ingredientPublicId: ing?.publicId ?? "",
      }),
    );

    return ingredients;
  } catch (error) {
    throw new Error("Error getting pantry", { cause: error });
  }
};

export const batchUpdatePantry = async ({
  userId,
  newIngredients,
  updatedIngredients,
  deletedIngredientIds,
}: {
  userId: number;
  newIngredients: InsertPublicPantryIngredient[];
  updatedIngredients: (InsertPublicPantryIngredient & { publicId: string })[];
  deletedIngredientIds: string[];
}) => {
  const allIngredientPublicIds = [
    ...newIngredients.map(({ ingredientPublicId }) => ingredientPublicId),
    ...updatedIngredients.map(({ ingredientPublicId }) => ingredientPublicId),
  ];

  try {
    return await db.transaction(async (tx) => {
      const ingredientsFoundByPublicId =
        allIngredientPublicIds.length > 0
          ? await tx
              .select({
                publicId: ingredientTable.publicId,
                id: ingredientTable.id,
              })
              .from(ingredientTable)
              .where(
                and(
                  eq(ingredientTable.userId, userId),
                  inArray(ingredientTable.publicId, allIngredientPublicIds),
                ),
              )
          : [];

      const ingredientIdMap = ingredientsFoundByPublicId.reduce<
        Record<string, number>
      >((map, { publicId, id }) => {
        map[publicId] = id;
        return map;
      }, {});

      // Insert new ingredients
      if (newIngredients.length > 0) {
        const insertValues: InsertPantryIngredient[] = newIngredients.map(
          (ingredient) => {
            const ingredientId = ingredientIdMap[ingredient.ingredientPublicId];
            if (!ingredientId) {
              throw new Error(
                `Master ingredient not found for publicId: ${ingredient.ingredientPublicId}`,
              );
            }
            return {
              quantity: ingredient.quantity ?? 1,
              userId,
              ingredientId,
              capacity: ingredient.capacity,
              unit: ingredient.unit,
            };
          },
        );

        await tx
          .insert(pantryIngredientTable)
          .values(insertValues)
          .onConflictDoNothing()
          .returning();
      }

      // Update existing ingredients
      for (const ingredient of updatedIngredients) {
        const ingredientId = ingredientIdMap[ingredient.ingredientPublicId];
        if (!ingredientId) {
          throw new Error(
            `Master ingredient not found for publicId: ${ingredient.ingredientPublicId}`,
          );
        }
        await tx
          .update(pantryIngredientTable)
          .set({
            ingredientId,
            capacity: ingredient.capacity,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          })
          .where(
            and(
              eq(pantryIngredientTable.publicId, ingredient.publicId),
              eq(pantryIngredientTable.userId, userId),
            ),
          );
      }

      // Delete ingredients
      if (deletedIngredientIds.length > 0) {
        await tx
          .delete(pantryIngredientTable)
          .where(
            and(
              eq(pantryIngredientTable.userId, userId),
              inArray(pantryIngredientTable.publicId, deletedIngredientIds),
            ),
          );
      }

      // Return full pantry state after mutation
      const sourceOfTruth = await tx
        .select()
        .from(pantryIngredientTable)
        .leftJoin(
          ingredientTable,
          eq(ingredientTable.id, pantryIngredientTable.ingredientId),
        )
        .where(eq(pantryIngredientTable.userId, userId));

      const ingredients: SelectPublicPantryIngredient[] = sourceOfTruth.map(
        ({ pantry_ingredients: pi, ingredients: ing }) => ({
          updatedAt: pi.updatedAt,
          createdAt: pi.createdAt,
          deletedAt: pi.deletedAt,
          publicId: pi.publicId,
          capacity: pi.capacity,
          quantity: pi.quantity,
          unit: pi.unit,
          name: ing?.name ?? "",
          ingredientPublicId: ing?.publicId ?? "",
        }),
      );

      return ingredients;
    });
  } catch (error) {
    throw new Error("Error updating pantry", { cause: error });
  }
};