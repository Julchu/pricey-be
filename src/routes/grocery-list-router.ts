import { Router } from "express";
import {
  getAllGroceryLists,
  upsertGroceryList,
} from "../services/grocery-list-handlers.ts";

export const groceryListRouter = Router();

groceryListRouter.get("/", async (req, res) => {
  res.send({ title: "The Pricey App" });
});

groceryListRouter.get("/:userId", async (req, res) => {
  await getAllGroceryLists(req.body);
  res.send({ title: "The Pricey App" });
});

// Verify that userId owns groceryListId before inserting ingredient
// TODO: when inserting groceryList and groceryListIngredients, do as transaction to ensure failure doesn't save anything
groceryListRouter.post("/", async (req, res) => {
  console.log("groceryList", req.body.groceryList);
  await upsertGroceryList(req.body.groceryList);
  res.send({ title: "The Pricey App" });
});