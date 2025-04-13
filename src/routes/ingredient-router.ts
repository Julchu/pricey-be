import { Router } from "express";
import { randomlyFillDb } from "../services/test-db.ts";

export const ingredientRouter = Router();

/* GET home page. */
ingredientRouter.get("/", async (req, res) => {
  res.send({ title: "The Pricey App" });
});

ingredientRouter.post("/", async (req, res) => {
  console.log("ingredient", req.body.ingredient);
  res.send({ title: "The Pricey App" });
});

ingredientRouter.get("/test", async (req, res) => {
  try {
    // await testDb();
    await randomlyFillDb();
  } catch (error) {
    console.log(error);
  }

  res.send({ test: "test" });
});