import { drizzle } from "drizzle-orm/postgres-js";
import { ingredientTable } from "./schemas/ingredient.schema";
import { userTable } from "./schemas/user.schema";
import { groceryListTable } from "./schemas/grocery-list.schema";
import { groceryListIngredientTable } from "./schemas/grocery-list-ingredient.schema";
import { recipeTable } from "./schemas/recipe.schema";
import { recipeIngredientTable } from "./schemas/recipe-ingredient.schema";
import { pantryIngredientTable } from "./schemas/pantry-ingredient.schema.ts";

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
    pantryIngredientTable,
  },
});