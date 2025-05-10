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
    res.status(400).json({ success: false, error: "Invalid user ID" });
    return;
  }

  res.send({ title: "The Pricey App" });
});

indexRouter.post("/seed", async (req, res) => {
  try {
    const token = req.header("Authorization")?.split("Bearer ")[1];
    if (token === process.env.SEED_KEY) {
      const prefilledInfo = await prefillDb();
      res.status(200).json({ success: true, data: prefilledInfo });
      return;
    }
    res.status(401).json({ success: false, error: "Not an admin" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error prefilling database" });
  }
});