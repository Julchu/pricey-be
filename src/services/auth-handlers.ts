// Can pass values to req; ex: req.userId = "userId"; console.log(req['userId])
import type { AuthRequest } from "../utils/interfaces.ts";
import type { NextFunction, Response } from "express";
import { jwtVerify, SignJWT } from "jose";
import { db } from "../db";
import { userTable } from "../db/schemas/user-schema.ts";
import { eq } from "drizzle-orm";

type JwtPayload = {
  userId: number;
};

export const verifyToken = async (token?: string) => {
  if (!token) return;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    return await jwtVerify<JwtPayload>(token, secret);
  } catch (error) {
    throw new Error("Error authenticating user, invalid or expired token", {
      cause: error,
    });
  }
};

export const createToken = async (userId: number) => {
  if (!userId) return;

  await db.select().from(userTable).where(eq(userTable.id, userId));

  const payload: JwtPayload = {
    userId,
  };

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
};

/**
 * Login: checks existence of user before returning token
 * Register: creates new user (if error isn't thrown) and returns token
 * userRequired: checks header auth token in any API call (that isn't login/register)
 * */
export const loginCheck = async (email?: string) => {
  if (!email) return;

  try {
    const fetchedUser = await db.query.userTable.findFirst({
      where: (user) => eq(user.email, email),
    });

    if (!fetchedUser) return;

    return createToken(fetchedUser.id);
  } catch (error) {
    throw new Error("Failed to login", { cause: error });
  }
};

// Need userRequired and AuthRequest req type to pass req.userId
export const userRequired = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.split("Bearer ")[1];
    const auth = await verifyToken(token);
    if (auth) {
      req.userId = auth.payload.userId;
      next();
    } else res.status(401).send("Unauthorized");
  } catch (error) {
    throw new Error("Unable to authenticate user", { cause: error });
  }
};