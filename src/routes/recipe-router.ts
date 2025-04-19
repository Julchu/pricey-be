import { Router } from "express";
import { getAllRecipes, upsertRecipe } from "../services/recipe-handlers.ts";

export const recipeRouter = Router();

recipeRouter.get("/", async (req, res) => {
  res.send({ title: "The Pricey App" });
});

recipeRouter.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const recipes = await getAllRecipes(parseInt(req.params.userId));
    res.json(recipes);
  } catch (error) {
    console.error("Failed to get recipes", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Verify that userId owns recipeId before inserting ingredient
recipeRouter.post("/", async (req, res) => {
  try {
    const recipe = await upsertRecipe(req.body.recipe, req.body.ingredients);

    res.json(recipe);
  } catch (error) {
    console.error("Failed to update recipe", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});