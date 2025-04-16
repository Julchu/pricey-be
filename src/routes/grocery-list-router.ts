import { Router } from "express";
import {
  getAllGroceryLists,
  insertTempGroceryLists,
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

groceryListRouter.post("/", async (req, res) => {
  console.log("groceryList", req.body.groceryList);
  await upsertGroceryList(req.body.groceryList);
  res.send({ title: "The Pricey App" });
});

groceryListRouter.post("/seed", async (req, res) => {
  try {
    await insertTempGroceryLists();
  } catch (error) {
    console.log(error);
  }

  res.send({ test: "test" });
});