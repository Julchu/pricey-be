import { Router } from "express";
import {
  getAllIngredients,
  upsertIngredient,
} from "../services/ingredient-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";
import type { InsertPublicIngredient } from "../db/schemas/ingredient-schema.ts";

export const ingredientRouter = Router();

ingredientRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ success: false, error: "Invalid user ID" });
    return;
  }

  try {
    const ingredients = await getAllIngredients(req.userId);
    res.json({ success: true, data: ingredients });
  } catch (error) {
    console.error("Failed to get ingredients", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

ingredientRouter.post(
  "/",
  async (
    req: AuthRequest<
      unknown,
      unknown,
      { ingredient: Omit<InsertPublicIngredient, "userId"> }
    >,
    res,
  ) => {
    if (!req.userId) {
      res.status(400).json({ success: false, error: "Invalid user ID" });
      return;
    }

    try {
      const ingredient = await upsertIngredient(
        req.body.ingredient,
        req.userId,
      );
      // TODO: omit private fields
      res.json({ success: true, data: ingredient[0] });
    } catch (error) {
      console.error("Failed to save new ingredient", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to save new ingredient" });
    }
  },
);