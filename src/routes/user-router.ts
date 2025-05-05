import { type Response, Router } from "express";
import {
  getUserById,
  registerUser,
  updateUser,
} from "../services/user-handlers.ts";
import type { AuthRequest } from "../utils/interfaces.ts";
import type { InsertUser } from "../db/schemas/user-schema.ts";
import { loginCheck, userRequired } from "../services/auth-handlers.ts";

export const userRouter = Router();

userRouter.get("/", userRequired, async (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ success: false, error: "Invalid user ID" });
    return;
  }

  try {
    const user = await getUserById(req.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Failed to get user", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
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
      res.status(400).json({ success: false, error: "Invalid user ID" });
      return;
    }

    try {
      const updatedUser = await updateUser(req.userId, req.body.user);
      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.error("Failed to get user", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  },
);

userRouter.post("/login", async (req, res) => {
  try {
    const loginResponse = await loginCheck(req.body.email);

    if (!loginResponse || !loginResponse.tokens) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const {
      tokens: { accessToken, refreshToken },
      userInfo,
    } = loginResponse;

    res.cookie("pricey_access_token", accessToken, {
      httpOnly: true, // To make it inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Only set over HTTPS in production
      sameSite: "strict",
      maxAge: 3600000, // 1 hour expiration time
    });

    res.cookie("pricey_refresh_token", refreshToken, {
      httpOnly: true, // To make it inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Only set over HTTPS in production
      sameSite: "strict",
      maxAge: 604800000, // 7 day expiration time
    });

    res.json({ success: true, data: userInfo });
  } catch (error) {
    console.error("Failed to login", error);
    res.status(500).json({ success: false, error: "Invalid login" });
  }
});

userRouter.post("/register", async (req, res) => {
  try {
    const newUser = await registerUser(req.body.user);
    if (newUser) res.status(200).json({ success: true, data: newUser });
    else
      res
        .status(400)
        .json({ success: false, error: "Could not create new user" });
  } catch (error) {
    console.error("Failed to get user", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

userRouter.post("/logout", userRequired, (req: AuthRequest, res) => {
  if (!req.userId) {
    res.status(400).json({ success: false, error: "Invalid user ID" });
    return;
  }

  res.clearCookie("pricey_access_token");
  res.clearCookie("pricey_refresh_token");

  res.status(200).json({ success: true, data: undefined });
});