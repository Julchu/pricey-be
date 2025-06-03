import { Router } from "express";
import {
  getAllGroceryLists,
  insertGroceryList,
} from "../services/grocery-list-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";

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

// Verify that userId owns groceryListId before inserting ingredient
groceryListRouter.post("/", async (req, res) => {
  const { ingredients, ...groceryList } = req.body.groceryList;
  await insertGroceryList(groceryList, ingredients);
  res.json({ title: "The Pricey App" });
});