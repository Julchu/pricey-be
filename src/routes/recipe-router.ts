import { Router } from "express";
import { getAllRecipes, getRecipe } from "../services/recipe-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";
import type { InsertPublicRecipe } from "../db/schemas/recipe-schema.ts";
import type { InsertPublicRecipeIngredient } from "../db/schemas/recipe-ingredient-schema.ts";

export const recipeRouter = Router();

recipeRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ success: false, error: "Invalid user ID" });
    return;
  }

  try {
    const recipes = await getAllRecipes(req.userId);
    res.json({ success: true, data: recipes });
  } catch (error) {
    console.error("Failed to get recipes", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

recipeRouter.get(
  "/:recipeId",
  async (req: AuthRequest<{ recipeId: string }>, res) => {
    if (!req.userId) {
      res.status(400).json({ success: false, error: "Invalid user ID" });
      return;
    }

    const recipe = await getRecipe(req.params.recipeId, req.userId);
    res.json({
      success: true,
      data: recipe,
    });
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
      {
        recipe: InsertPublicRecipe;
        ingredients: InsertPublicRecipeIngredient[];
      }
    >,
    res,
  ) => {
    if (!req.userId) {
      res.status(400).json({ success: false, error: "Invalid user ID" });
      return;
    }

    try {
      // const recipe = await insertRecipe(req.body.recipe, req.body.ingredients);
      res.json({ success: true, data: "recipe" });
    } catch (error) {
      console.error("Failed to update recipe", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to update recipe" });
    }
  },
);