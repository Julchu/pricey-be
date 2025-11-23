import { Router } from "express";
import {
  deleteGroceryList,
  getAllGroceryLists,
  getGroceryList,
  insertGroceryList,
  updateGroceryList,
} from "../services/grocery-list-handlers.ts";
import type { AuthRequest, GroceryList } from "../utils/interfaces.ts";
import type { InsertPublicGroceryList } from "../db/schemas/grocery-list-schema.ts";
import type { InsertPublicGroceryListIngredient } from "../db/schemas/grocery-list-ingredient-schema.ts";

export const groceryListRouter = Router();

groceryListRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Invalid user ID" });
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
      res.status(401).json({ success: false, error: "Invalid user ID" });
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
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }

    const { ingredients, ...newGroceryList } = req.body.groceryList;

    try {
      const groceryList = await insertGroceryList({
        groceryList: newGroceryList,
        groceryListIngredients: ingredients,
        userId: req.userId,
      });

      if (!groceryList) {
        res.json({ success: false, error: "Grocery list does not exist" });
        return;
      }

      res.json({ success: true, data: groceryList });
    } catch (error) {
      console.error("Failed to save new grocery list", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to save new grocery list" });
    }
  },
);

groceryListRouter.patch(
  "/:groceryListId",
  async (
    req: AuthRequest<
      unknown,
      unknown,
      {
        groceryList: InsertPublicGroceryList;
        deletedIngredientIds: string[];
        newIngredients: InsertPublicGroceryListIngredient[];
        updatedIngredients: InsertPublicGroceryListIngredient[];
      }
    >,
    res,
  ) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }
    try {
      const groceryList = req.body.groceryList;
      const deletedIngredientIds = req.body.deletedIngredientIds;
      const newIngredients = req.body.newIngredients;
      const updatedIngredients = req.body.updatedIngredients;
      const userId = req.userId;

      console.log("groceryList", groceryList);
      console.log("deletedIngredientIds", deletedIngredientIds);
      console.log("newIngredients", newIngredients);
      console.log("updatedIngredients", updatedIngredients);

      const updatedGroceryList = await updateGroceryList({
        groceryList,
        deletedIngredientIds,
        newIngredients,
        updatedIngredients,
        userId,
      });

      if (!updatedGroceryList) {
        res.status(404).json({
          success: false,
          error: "Grocery list could not be updated",
        });
        return;
      }

      res.json({
        success: true,
        data: updatedGroceryList,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: `Failed to update grocery list: ${error}`,
      });
    }
  },
);

groceryListRouter.delete(
  "/:groceryListId",
  async (req: AuthRequest<{ groceryListId: string }>, res) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
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