import { Router } from "express";
import { prefillDb } from "../services/prefill-data/functions.ts";
import { userRequired } from "../services/auth-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";
import { getUserById } from "../services/user-handlers.ts";

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

indexRouter.post("/seed", userRequired, async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ success: false, error: "Invalid user ID" });
    return;
  }

  try {
    const user = await getUserById(req.userId);
    if (user && user.email === "julianchutor@gmail.com") {
      const prefilledInfo = await prefillDb();
      res.status(200).json({ success: true, data: prefilledInfo });
      return;
    }
    res.status(400).json({ success: false, error: "Not an admin" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error prefilling database" });
  }
});