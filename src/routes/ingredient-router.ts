import { Router } from "express";
import { testDb } from "../services/test-db.ts";

export const ingredientRouter = Router();

/* GET home page. */
ingredientRouter.get("/", async (req, res) => {
  await testDb();
  res.send({ title: "The Pricey App" });
});