import { Router } from "express";
import { batchUpdatePantry, getPantry } from "./pantry.service.ts";
import { batchUpdatePantrySchema } from "./pantry.validation.ts";
import type { AuthRequest } from "../../types";

export const pantryRouter = Router();

pantryRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Invalid user ID" });
    return;
  }

  try {
    const ingredients = await getPantry(req.userId);
    res.json({ success: true, data: ingredients });
  } catch (error) {
    console.error("Failed to get pantry", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

pantryRouter.patch(
  "/",
  async (
    req: AuthRequest<
      unknown,
      unknown,
      {
        newIngredients?: unknown;
        updatedIngredients?: unknown;
        deletedIngredientIds?: unknown;
      }
    >,
    res,
  ) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }

    const { data, error } = batchUpdatePantrySchema.safeParse(req.body);
    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    try {
      const result = await batchUpdatePantry({
        userId: req.userId,
        newIngredients: data.newIngredients,
        updatedIngredients: data.updatedIngredients,
        deletedIngredientIds: data.deletedIngredientIds,
      });

      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Failed to update pantry", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },
);