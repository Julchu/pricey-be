import { Router } from "express";

export const groceriesRouter = Router();

/* GET home page. */
groceriesRouter.get("/", (req, res) => {
  res.send({ title: "The Pricey App" });
});