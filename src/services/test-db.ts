import { db } from "../db";
import { ingredientTable } from "../db/schemas/ingredient-schema.ts";
import { seed } from "drizzle-seed";
import { groceryListTable } from "../db/schemas/grocery-list-schema.ts";
import { userTable } from "../db/schemas/user-schema.ts";
import { recipeTable } from "../db/schemas/recipe-schema.ts";

export const randomlyFillDb = async () => {
  await seed(db, { userTable, ingredientTable, groceryListTable, recipeTable });
};