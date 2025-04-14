import { Router } from "express";
import { upsertRecipe } from "../services/recipe-handlers.ts";

export const recipeRouter = Router();

recipeRouter.get("/", async (req, res) => {
  res.send({ title: "The Pricey App" });
});

recipeRouter.post("/", async (req, res) => {
  console.log("recipe", req.body.recipe);
  await upsertRecipe(req.body.recipe);
  res.send({ title: "The Pricey App" });
});