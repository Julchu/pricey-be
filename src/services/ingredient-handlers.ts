import { db } from "../db";
import {
  ingredientTable,
  type InsertIngredient,
  tempIngredients,
} from "../db/schemas/ingredient-schema.ts";
import { Season, Unit } from "../utils/interfaces.ts";
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

export const insertTempIngredients = () => {
  return db.insert(ingredientTable).values(tempIngredients).returning();
};

export const testIngredientDb = async () => {
  const ingredient: InsertIngredient = {
    name: "Tomato",
    price: 250,
    unit: Unit.KILOGRAM,
    capacity: 5,
    quantity: 2,
    userId: 0,
    season: Season.SUMMER,
  };

  await db.insert(ingredientTable).values(ingredient);
  console.log("New ingredient created!");

  const ingredients = await db.select().from(ingredientTable);
  console.log("Getting all ingredients from the database: ", ingredients);

  await db
    .update(ingredientTable)
    .set({
      season: Season.FALL,
    })
    .where(eq(ingredientTable.name, ingredient.name));
  console.log("Ingredient season info updated!");

  await db
    .delete(ingredientTable)
    .where(eq(ingredientTable.name, ingredient.name));
  console.log("ingredient deleted!");
};