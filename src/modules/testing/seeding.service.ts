import { db } from "../../db";
import { userTable } from "../../db/schemas/user.schema";
import { ingredientTable } from "../../db/schemas/ingredient.schema";
import { recipeTable } from "../../db/schemas/recipe.schema";
import { groceryListTable } from "../../db/schemas/grocery-list.schema";
import { recipeIngredientTable } from "../../db/schemas/recipe-ingredient.schema";
import { groceryListIngredientTable } from "../../db/schemas/grocery-list-ingredient.schema";
import {
  seedGroceryListIngredients,
  seedGroceryLists,
  seedIngredients,
  seedRecipeIngredients,
  seedRecipes,
  seedUsers,
} from "./seed-data";

// ==================== INSERTION FUNCTIONS ====================

/**
 * Inserts users and returns inserted records with their generated IDs
 */
export const insertUsers = async () => {
  const inserted = await db.insert(userTable).values(seedUsers).returning();
  console.log(`Inserted ${inserted.length} users`);
  return inserted;
};

/**
 * Inserts ingredients for a specific user
 */
export const insertIngredients = async (userId: number) => {
  const values = seedIngredients.map((ingredient) => ({
    ...ingredient,
    userId,
  }));

  const inserted = await db.insert(ingredientTable).values(values).returning();
  console.log(`Inserted ${inserted.length} ingredients for user ${userId}`);
  return inserted;
};

/**
 * Inserts recipes for a specific user
 */
export const insertRecipes = async (userId: number) => {
  const values = seedRecipes.map((recipe) => ({
    ...recipe,
    userId,
  }));

  const inserted = await db.insert(recipeTable).values(values).returning();
  console.log(`Inserted ${inserted.length} recipes for user ${userId}`);
  return inserted;
};

/**
 * Inserts grocery lists for a specific user
 */
export const insertGroceryLists = async (userId: number) => {
  const values = seedGroceryLists.map((list) => ({
    ...list,
    userId,
  }));

  const inserted = await db.insert(groceryListTable).values(values).returning();
  console.log(`Inserted ${inserted.length} grocery lists for user ${userId}`);
  return inserted;
};

/**
 * Inserts recipe ingredients using ingredient ID map
 */
export const insertRecipeIngredients = async (
  recipeId: number,
  recipeIndex: number,
  ingredientMap: Record<string, number>,
) => {
  const ingredientsToInsert = seedRecipeIngredients[recipeIndex];

  if (!ingredientsToInsert || ingredientsToInsert.length === 0) {
    console.log(`No ingredients to insert for recipe ${recipeId}`);
    return [];
  }

  const values = ingredientsToInsert.map(
    ({ name, capacity, quantity, unit, image }) => {
      const ingredientId = ingredientMap[name];
      if (!ingredientId) {
        console.warn(`Ingredient "${name}" not found in map`);
      }
      return {
        recipeId,
        ingredientId: ingredientId || null,
        name,
        capacity,
        quantity,
        unit,
        image,
      };
    },
  );

  const inserted = await db
    .insert(recipeIngredientTable)
    .values(values)
    .returning();
  console.log(`Inserted ${inserted.length} ingredients for recipe ${recipeId}`);
  return inserted;
};

/**
 * Inserts grocery list ingredients using ingredient ID map
 */
export const insertGroceryListIngredients = async (
  groceryListId: number,
  listIndex: number,
  ingredientMap: Record<string, number>,
) => {
  const ingredientsToInsert = seedGroceryListIngredients[listIndex];

  if (!ingredientsToInsert || ingredientsToInsert.length === 0) {
    console.log(`No ingredients to insert for grocery list ${groceryListId}`);
    return [];
  }

  const values = ingredientsToInsert.map((li) => {
    const ingredientId = ingredientMap[li.ingredientName];
    if (!ingredientId) {
      console.warn(`Ingredient "${li.ingredientName}" not found in map`);
    }
    return {
      groceryListId,
      ingredientId: ingredientId || null,
      name: li.ingredientName,
      capacity: li.capacity,
      quantity: li.quantity,
      unit: li.unit,
      image: li.image,
    };
  });

  const inserted = await db
    .insert(groceryListIngredientTable)
    .values(values)
    .returning();
  console.log(
    `Inserted ${inserted.length} ingredients for grocery list ${groceryListId}`,
  );
  return inserted;
};

// ==================== MASTER SEED FUNCTION ====================

export type SeedResult = {
  users: Awaited<ReturnType<typeof insertUsers>>;
  ingredients: Awaited<ReturnType<typeof insertIngredients>>;
  recipes: Awaited<ReturnType<typeof insertRecipes>>;
  groceryLists: Awaited<ReturnType<typeof insertGroceryLists>>;
  recipeIngredients: Awaited<ReturnType<typeof insertRecipeIngredients>>[];
  groceryListIngredients: Awaited<
    ReturnType<typeof insertGroceryListIngredients>
  >[];
};

export const prefillDb = async (): Promise<SeedResult> => {
  console.log("Starting database seeding...");

  try {
    const users = await insertUsers();

    const mainUser =
      users.find((u) => u.email === process.env.MASTER_TEST_EMAIL) ||
      users[users.length - 1];

    if (!mainUser) {
      throw new Error("No users were inserted");
    }

    const { id: mainUserId } = mainUser;

    const ingredients = await insertIngredients(mainUserId);

    const ingredientMap = Object.fromEntries(
      ingredients.map(({ name, id }) => [name, id]),
    );
    console.log(`Created ingredient map with ${ingredientMap.size} entries`);

    // Step 3: Insert recipes (depends on user)
    const recipes = await insertRecipes(mainUserId);

    // Step 4: Insert grocery lists (depends on user)
    const groceryLists = await insertGroceryLists(mainUserId);

    // Step 5: Insert recipe ingredients (depends on recipes and ingredients)
    const recipeIngredientsResults: SeedResult["recipeIngredients"] = [];
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      if (!recipe) continue;
      const result = await insertRecipeIngredients(recipe.id, i, ingredientMap);
      recipeIngredientsResults.push(result);
    }

    // Step 6: Insert grocery list ingredients (depends on grocery lists and ingredients)
    const groceryListIngredientsResults: SeedResult["groceryListIngredients"] =
      [];
    for (let i = 0; i < groceryLists.length; i++) {
      const list = groceryLists[i];
      if (!list) continue;
      const result = await insertGroceryListIngredients(
        list.id,
        i,
        ingredientMap,
      );
      groceryListIngredientsResults.push(result);
    }

    console.log("Database seeding completed successfully!");

    return {
      users,
      ingredients,
      recipes,
      groceryLists,
      recipeIngredients: recipeIngredientsResults,
      groceryListIngredients: groceryListIngredientsResults,
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

export const clearDatabase = async () => {
  await db.delete(userTable);
  console.log("Cleared users");
};

export const resetDatabase = async () => {
  await clearDatabase();
  return await prefillDb();
};