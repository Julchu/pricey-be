import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  ingredientTable,
  type InsertIngredient,
} from "../db/schemas/ingredient-schema.ts";
import { Unit } from "../utils/interfaces.ts";
import { seed } from "drizzle-seed";
import { groceryListTable } from "../db/schemas/grocery-list-schema.ts";

export const testDb = async () => {
  const ingredient: InsertIngredient = {
    name: "Tomato",
    price: 250,
    unit: Unit.KILOGRAM,
    capacity: 5,
    quantity: 2,
    // userId: 0,
    // season: Season.SUMMER,
  };

  await db.insert(ingredientTable).values(ingredient);
  console.log("New ingredient created!");

  const ingredients = await db.select().from(ingredientTable);
  console.log("Getting all ingredients from the database: ", ingredients);

  await db
    .update(ingredientTable)
    .set({
      // season: Season.FALL,
    })
    .where(eq(ingredientTable.name, ingredient.name));
  console.log("Ingredient season info updated!");

  await db
    .delete(ingredientTable)
    .where(eq(ingredientTable.name, ingredient.name));
  console.log("ingredient deleted!");
};

export const randomlyFillDb = async () => {
  await seed(db, { groceryListTable });
};