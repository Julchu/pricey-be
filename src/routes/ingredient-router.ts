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

ingredientRouter.post("/seed", async (req, res) => {
  try {
    await insertTempIngredients();
    res.status(200).send({ title: "The Pricey App" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ title: "The Pricey App" });
  }
});