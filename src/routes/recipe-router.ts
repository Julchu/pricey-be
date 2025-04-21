import { Router } from "express";
import {
  getAllRecipes,
  getRecipe,
  upsertRecipe,
} from "../services/recipe-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";
import type { InsertRecipe } from "../db/schemas/recipe-schema.ts";
import type { InsertRecipeIngredient } from "../db/schemas/recipe-ingredient-schema.ts";

export const recipeRouter = Router();

recipeRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const recipes = await getAllRecipes(req.userId);
    res.json(recipes);
  } catch (error) {
    console.error("Failed to get recipes", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

recipeRouter.get(
  "/:recipeId",
  async (req: AuthRequest<{ recipeId: number }>, res) => {
    if (!req.userId) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    res.json(await getRecipe(req.params.recipeId, req.userId));
    return;
  },
);

// TODO: Verify that userId owns recipeId before inserting ingredient
recipeRouter.post(
  "/",
  async (
    req: AuthRequest<
      unknown,
      unknown,
      { recipe: InsertRecipe; ingredients: InsertRecipeIngredient[] }
    >,
    res,
  ) => {
    if (!req.userId) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    try {
      const recipe = await upsertRecipe(req.body.recipe, req.body.ingredients);
      res.json(recipe);
    } catch (error) {
      console.error("Failed to update recipe", error);
      res.status(500).json({ error: "Failed to update recipe" });
    }
  },
);