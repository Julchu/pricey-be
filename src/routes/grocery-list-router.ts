import { Router } from "express";
import { upsertGroceryList } from "../services/grocery-list-handlers.ts";

export const groceryListRouter = Router();

groceryListRouter.get("/", async (req, res) => {
  res.send({ title: "The Pricey App" });
});

groceryListRouter.post("/", async (req, res) => {
  console.log("groceryList", req.body.groceryList);
  await upsertGroceryList(req.body.groceryList);
  res.send({ title: "The Pricey App" });
});