import { Router } from "express";

export const indexRouter = Router();

/* GET home page. */
indexRouter.get("/", (req, res) => {
  res.render("index", { title: "The Pricey App" });
});