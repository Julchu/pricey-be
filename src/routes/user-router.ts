import { Router } from "express";
import { getUser, insertUser, updateUser } from "../services/user-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";
import type { InsertUser } from "../db/schemas/user-schema.ts";

export const userRouter = Router();

userRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const user = await getUser(req.userId);
    res.json(user);
  } catch (error) {
    console.error("Failed to get user", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.post(
  "/",
  async (req: AuthRequest<unknown, unknown, { user: InsertUser }>, res) => {
    try {
      res.status(200).json(await insertUser(req.body.user));
    } catch (error) {
      console.error("Failed to get user", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// TODO: test if need to filter user form data email (conflict if user exists)
userRouter.patch(
  "/",
  async (req: AuthRequest<unknown, unknown, { user: InsertUser }>, res) => {
    if (!req.userId) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    try {
      res.status(200).json(await updateUser(req.userId, req.body.user));
    } catch (error) {
      console.error("Failed to get user", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);