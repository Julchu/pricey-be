import { Router } from "express";
import { prefillDb, resetDatabase } from "./seeding.service.ts";
import { userSetter } from "../../lib/auth/auth-handlers";
import type { AuthRequest } from "../../types";

export const seedingRouter = Router();

/* GET home page. */
seedingRouter.get("/", (req, res) => {
  res.json({ title: "The Pricey App" });
});

seedingRouter.post("/test", (req, res) => {
  const { stringField, numberField } = req.body;
  console.log("typeof stringField", typeof stringField);
  console.log("typeof numberField", typeof numberField);
  res.json({ stringField, numberField });
});

seedingRouter.get(
  "/test-user-required",
  userSetter,
  async (req: AuthRequest, res) => {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Invalid user ID" });
      return;
    }

    res.json({ title: "The Pricey App" });
  },
);

seedingRouter.post("/seed/reset", userSetter, async (req, res) => {
  try {
    const token = req.header("Authorization")?.split("Bearer ")[1];
    if (token === process.env.MASTER_KEY) {
      await resetDatabase();
      res.status(200).json({ success: true, data: "Database reset" });
      return;
    }
    res.status(401).json({ success: false, error: "Not an admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error resetting database" });
  }
  res.status(200).json({ success: true, data: "Database reset" });
});

seedingRouter.post("/seed", async (req, res) => {
  try {
    const token = req.header("Authorization")?.split("Bearer ")[1];
    if (token === process.env.MASTER_KEY) {
      const result = await prefillDb();
      res.status(200).json({
        success: true,
        data: {
          usersCreated: result.users.length,
          ingredientsCreated: result.ingredients.length,
          recipesCreated: result.recipes.length,
          groceryListsCreated: result.groceryLists.length,
          recipeIngredientsCreated: result.recipeIngredients.reduce(
            (sum, arr) => sum + arr.length,
            0,
          ),
          groceryListIngredientsCreated: result.groceryListIngredients.reduce(
            (sum, arr) => sum + arr.length,
            0,
          ),
          pantryIngredientsCreated: result.pantryIngredients.length,
        },
      });
      return;
    }
    res.status(401).json({ success: false, error: "Not an admin" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error prefilling database" });
  }
});