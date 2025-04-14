import { Router } from "express";
import {
  insertTempIngredients,
  upsertIngredient,
} from "../services/ingredient-handlers.ts";

export const ingredientRouter = Router();

ingredientRouter.get("/", async (req, res) => {
  res.send({ title: "The Pricey App" });
});

ingredientRouter.post("/", async (req, res) => {
  console.log("ingredient", req.body.ingredient);
  await upsertIngredient(req.body.ingredient);
  res.send({ title: "The Pricey App" });
});

ingredientRouter.post("/test", async (req, res) => {
  try {
    await insertTempIngredients();
  } catch (error) {
    console.log(error);
  }

  res.send({ test: "test" });
});