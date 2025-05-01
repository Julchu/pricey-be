import { type Response, Router } from "express";
import {
  getUser,
  registerUser,
  updateUser,
} from "../services/user-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";
import type { InsertUser } from "../db/schemas/user-schema.ts";
import { loginCheck, userRequired } from "../services/auth-handlers.ts";

export const userRouter = Router();

userRouter.get("/", userRequired, async (req: AuthRequest, res) => {
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

// TODO: test if need to filter user form data email (conflict if user exists)
userRouter.patch(
  "/update",
  userRequired,
  async (
    req: AuthRequest<unknown, unknown, { user: InsertUser }>,
    res: Response,
  ) => {
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

userRouter.post("/login", async (req, res) => {
  try {
    const token = await loginCheck(req.body.email);
    if (token) {
      res.cookie("pricey_token", token, {
        httpOnly: true, // To make it inaccessible to JavaScript
        secure: process.env.NODE_ENV === "production", // Only set over HTTPS in production
        sameSite: "strict",
        maxAge: 3600000, // 1 hour expiration time
      });
      res.json({ message: "Token set in cookie" });
    } else res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.error("Failed to login", error);
    res.status(500).json({ error: "Invalid login" });
  }
});

userRouter.post("/register", async (req, res) => {
  try {
    const newUser = await registerUser(req.body.user);
    if (newUser) res.status(200).json(newUser);
    else res.status(400).json({ error: "Could not create new user" });
  } catch (error) {
    console.error("Failed to get user", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.post("/logout", (req, res) => {
  res.clearCookie("pricey_token");
  res.send({ message: "Logged out" });
});