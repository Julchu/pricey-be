import { db } from "../../db";
import {
  ingredientTable,
  type InsertIngredient,
} from "../../db/schemas/ingredient-schema.ts";
import { seed } from "drizzle-seed";
import { groceryListTable } from "../../db/schemas/grocery-list-schema.ts";
import { userTable } from "../../db/schemas/user-schema.ts";
import { recipeTable } from "../../db/schemas/recipe-schema.ts";
import { Season, Unit } from "../../utils/interfaces.ts";
import { eq } from "drizzle-orm";
import {
  tempGroceryListIngredients,
  tempGroceryLists,
  tempIngredients,
  tempRecipeIngredients,
  tempRecipes,
  tempUsers,
} from "./data.ts";
import { groceryListIngredientTable } from "../../db/schemas/grocery-ingredient-schema.ts";
import { recipeIngredientTable } from "../../db/schemas/recipe-ingredient-schema.ts";

export const prefillDb = async () => {
  try {
    await insertTempUsers();
    await insertTempRecipes();
    await insertTempIngredients();
    await insertTempGroceryLists();
    await insertTempGroceryListIngredients();
    await insertTempRecipeIngredients();
  } catch (error) {
    throw new Error("Error prefilling db", {
      cause: error,
    });
  }
};

const insertTempUsers = async () => {
  try {
    return await db
      .insert(userTable)
      .values(tempUsers)
      .onConflictDoNothing()
      .returning();
  } catch (error) {
    throw new Error("Error inserting temp users", { cause: error });
  }
};

const insertTempRecipes = async () => {
  try {
    return await db
      .insert(recipeTable)
      .values(tempRecipes)
      .onConflictDoNothing()
      .returning();
  } catch (error) {
    throw new Error("Error inserting temp recipes", { cause: error });
  }
};

const insertTempIngredients = async () => {
  try {
    return await db
      .insert(ingredientTable)
      .values(tempIngredients)
      .onConflictDoNothing()
      .returning();
  } catch (error) {
    throw new Error("Error inserting temp ingredients", { cause: error });
  }
};

const insertTempGroceryLists = async () => {
  try {
    return await db
      .insert(groceryListTable)
      .values(tempGroceryLists)
      .onConflictDoNothing()
      .returning();
  } catch (error) {
    throw new Error("Error inserting temp grocery lists", { cause: error });
  }
};

const insertTempGroceryListIngredients = async () => {
  try {
    return await db
      .insert(groceryListIngredientTable)
      .values(tempGroceryListIngredients)
      .onConflictDoNothing()
      .returning();
  } catch (error) {
    throw new Error("Error inserting temp users", { cause: error });
  }
};

const insertTempRecipeIngredients = async () => {
  try {
    return await db
      .insert(recipeIngredientTable)
      .values(tempRecipeIngredients)
      .onConflictDoNothing()
      .returning();
  } catch (error) {
    throw new Error("Error inserting temp users", { cause: error });
  }
};

export const randomlyFillDb = async () => {
  await seed(db, { userTable, ingredientTable, groceryListTable, recipeTable });
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