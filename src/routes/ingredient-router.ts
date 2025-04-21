import { Router } from "express";
import {
  getAllIngredients,
  upsertIngredient,
} from "../services/ingredient-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";

export const ingredientRouter = Router();

ingredientRouter.get("/", async (req, res) => {
  res.send({ title: "The Pricey App" });
});

ingredientRouter.get("/:userId", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const ingredients = await getAllIngredients(req.userId);
    res.json(ingredients);
  } catch (error) {
    console.error("Failed to get ingredients", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

ingredientRouter.post("/", async (req, res) => {
  console.log("ingredient", req.body.ingredient);
  await upsertIngredient(req.body.ingredient);
  res.send({ title: "The Pricey App" });
});