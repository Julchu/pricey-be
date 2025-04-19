import { Router } from "express";
import { upsertUser } from "../services/user-handlers.ts";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  res.send({ title: "The Pricey App" });
});

userRouter.post("/", async (req, res) => {
  console.log("user", req.body.user);
  await upsertUser(req.body.user);
  res.send({ title: "The Pricey App" });
});