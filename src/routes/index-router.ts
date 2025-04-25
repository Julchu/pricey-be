import { Router } from "express";
import { prefillDb } from "../services/prefill-data/functions.ts";
import { userRequired } from "../services/auth-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";

export const indexRouter = Router();

/* GET home page. */
indexRouter.get("/", (req, res) => {
  res.send({ title: "The Pricey App" });
});

indexRouter.get("/test", userRequired, async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  res.send({ title: "The Pricey App" });
});

indexRouter.post("/seed", userRequired, async (req, res) => {
  try {
    await prefillDb();
    res.send({ title: "The Pricey App" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error prefilling database" });
  }
});