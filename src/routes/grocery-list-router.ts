import { Router } from "express";
import {
  deleteGroceryList,
  getAllGroceryLists,
  getGroceryList,
  insertGroceryList,
} from "../services/grocery-list-handlers.ts";
import type { AuthRequest, GroceryList } from "../utils/interfaces.ts";

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

groceryListRouter.get(
  "/:groceryListId",
  async (req: AuthRequest<{ groceryListId: string }>, res) => {
    if (!req.userId) {
      res.status(400).json({ success: false, error: "Invalid user ID" });
      return;
    }

    try {
      const groceryList = await getGroceryList(
        req.params.groceryListId,
        req.userId,
      );

      if (!groceryList) {
        res.status(404).json({
          success: false,
        });
        return;
      }

      res.json({
        success: true,
        data: groceryList,
      });
    } catch (error) {
      console.error("Failed to get specific grocery list", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to get specific grocery list" });
    }
  },
);

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

// Partial update (like public status, name)
groceryListRouter.patch("/:groceryListId", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ success: false, error: "Invalid user ID" });
    return;
  }
});

// Full update (like ingredients)
groceryListRouter.put("/:groceryListId", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ success: false, error: "Invalid user ID" });
    return;
  }
});

groceryListRouter.delete(
  "/:groceryListId",
  async (req: AuthRequest<{ groceryListId: string }>, res) => {
    if (!req.userId) {
      res.status(400).json({ success: false, error: "Invalid user ID" });
      return;
    }

    try {
      const deletedGroceryListId = await deleteGroceryList(
        req.params.groceryListId,
        req.userId,
      );

      if (!deletedGroceryListId) {
        res.status(404).json({
          success: false,
          error: "Grocery list does not exist",
        });
        return;
      }

      res.json({
        success: true,
        data: deletedGroceryListId.publicId,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Failed to delete grocery list: ${error}`,
      });
    }
  },
);