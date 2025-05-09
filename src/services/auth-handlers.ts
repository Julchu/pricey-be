// Can pass values to req; ex: req.userId = "userId"; console.log(req['userId])
import type { AuthRequest } from "../utils/interfaces.ts";
import type { NextFunction, Response } from "express";
import { jwtVerify, SignJWT } from "jose";
import { getUserByEmail } from "./user-handlers.ts";

type JwtPayload = {
  userId: number;
};

export const verifyToken = async (token?: string) => {
  if (!token) return;

  const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

  try {
    return await jwtVerify<JwtPayload>(token, secret);
  } catch (error) {
    throw new Error(
      "Error authenticating user, invalid or expired accessToken",
      {
        cause: error,
      },
    );
  }
};

export const createTokens = async (userId: number) => {
  if (!userId) return;

  const payload: JwtPayload = {
    userId,
  };

  const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
  const refreshSecret = new TextEncoder().encode(
    process.env.JWT_REFRESH_SECRET,
  );

  return {
    accessToken: await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(accessSecret),
    refreshToken: await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(refreshSecret),
  };
};

/**
 * Login: checks existence of user before returning accessToken
 * Register: creates new user (if error isn't thrown) and returns accessToken
 * userRequired: checks header auth accessToken in any API call (that isn't login/register)
 * */
export const loginCheck = async (email?: string) => {
  if (!email) return;

  try {
    const fetchedUser = await getUserByEmail(email);

    if (!fetchedUser) return;

    const { id, ...userInfo } = fetchedUser;
    const tokens = await createTokens(id);
    return {
      tokens,
      userInfo,
    };
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