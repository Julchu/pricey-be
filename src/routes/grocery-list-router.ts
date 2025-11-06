import { Router } from "express";
import {
  getAllGroceryLists,
  insertGroceryList,
} from "../services/grocery-list-handlers.ts";
import type { AuthRequest, GroceryList } from "../utils/interfaces.ts";

export const groceryListRouter = Router();

groceryListRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ success: false, error: "Invalid user ID" });
    return;
  }

  // TODO: combine grocery list with recipes
  try {
    const groceryLists = await getAllGroceryLists(req.userId);
    res.json({ success: true, data: groceryLists });
  } catch (error) {
    console.error("Failed to get grocery lists", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Verify that userId owns groceryListId before inserting ingredient
groceryListRouter.post(
  "/",
  async (
    req: AuthRequest<unknown, unknown, { groceryList: GroceryList }>,
    res,
  ) => {
    if (!req.userId) {
      res.status(400).json({ success: false, error: "Invalid user ID" });
      return;
    }

    try {
      const { ingredients, ...newGroceryList } = req.body.groceryList;
      const groceryLists = await insertGroceryList(
        newGroceryList,
        ingredients,
        req.userId,
      );
      res.json({ success: true, data: groceryLists });
    } catch (error) {
      console.error("Failed to save new grocery list", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to save new grocery list" });
    }
  },
);