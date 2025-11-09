import { drizzle } from "drizzle-orm/postgres-js";
import { ingredientTable } from "./schemas/ingredient-schema.ts";
import { userTable } from "./schemas/user-schema.ts";
import { groceryListTable } from "./schemas/grocery-list-schema.ts";
import { groceryListIngredientTable } from "./schemas/grocery-list-ingredient-schema.ts";
import { recipeTable } from "./schemas/recipe-schema.ts";
import { recipeIngredientTable } from "./schemas/recipe-ingredient-schema.ts";

// You can specify any property from the postgres-js connection options
export const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "staging",
  },
  schema: {
    userTable,
    ingredientTable,
    groceryListTable,
    groceryListIngredientTable,
    recipeTable,
    recipeIngredientTable,
  },
});