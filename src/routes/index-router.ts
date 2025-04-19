import { Router } from "express";
import { prefillDb } from "../services/prefill-data/functions.ts";

export const indexRouter = Router();

/* GET home page. */
indexRouter.get("/", (req, res) => {
  res.render("index", { title: "The Pricey App" });
});

indexRouter.post("/seed", async (req, res) => {
  try {
    await prefillDb();
    res.send({ title: "The Pricey App" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error prefilling database" });
  }
});