import { Router } from "express";
import {
  getAllIngredients,
  upsertIngredient,
} from "../services/ingredient-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";
import type { InsertPublicIngredient } from "../db/schemas/ingredient-schema.ts";
import { z } from "zod";

export const ingredientRouter = Router();

ingredientRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Invalid user ID" });
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

const insertIngredientSchema = z.object({
  ingredient: z.string(),
});

/*  const { data, error } = testSchema.safeParse(req.query);
  if (error) {
    return;
  }
  const { test } = data;
  console.log(test);*/

ingredientRouter.post(
  "/",
  async (
    req: AuthRequest<unknown, unknown, { ingredient: InsertPublicIngredient }>,
    res,
  ) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }

    const { data, error } = insertIngredientSchema.safeParse(req.body);
    if (error) {
      res.json({ success: false, error: error.message });
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