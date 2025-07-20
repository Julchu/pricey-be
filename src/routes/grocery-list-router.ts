import { Router } from "express";
import {
  getAllGroceryLists,
  upsertGroceryList,
} from "../services/grocery-list-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";
import type { InsertGroceryList } from "../db/schemas/grocery-list-schema.ts";
import type { InsertGroceryListIngredient } from "../db/schemas/grocery-ingredient-schema.ts";

export const groceryListRouter = Router();

groceryListRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ success: false, error: "Invalid user ID" });
    return;
  }

  try {
    const groceryLists = await getAllGroceryLists(req.userId);
    res.json({ success: true, data: groceryLists });
  } catch (error) {
    console.error("Failed to get grocery lists", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

type GroceryListFormData = {
  groceryList: Omit<InsertGroceryList, "userId">;
  ingredients: Omit<InsertGroceryListIngredient, "userId">[];
};

// Verify that userId owns groceryListId before inserting ingredient
groceryListRouter.post(
  "/",
  async (
    req: AuthRequest<
      unknown,
      unknown,
      { groceryListFormData: GroceryListFormData }
    >,
    res,
  ) => {
    if (!req.userId) {
      res.status(400).json({ success: false, error: "Invalid user ID" });
      return;
    }

    const { ingredients, groceryList } = req.body.groceryListFormData;
    await upsertGroceryList(groceryList, ingredients, req.userId);
    res.json({ title: "The Pricey App" });
  },
);