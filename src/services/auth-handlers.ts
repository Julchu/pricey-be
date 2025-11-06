// Can pass values to req; ex: req.userId = "userId"; console.log(req['userId])
import type { AuthRequest } from "../utils/interfaces.ts";
import type { NextFunction, Response } from "express";
import { jwtVerify, SignJWT } from "jose";
import { getUserByEmail, insertUser } from "./user-handlers.ts";

import { OAuth2Client } from "google-auth-library";

type JwtPayload = {
  userId: string;
};

export const verifyGoogleToken = async (code: string) => {
  const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URIS,
  });

  const { tokens } = await client.getToken(code); // exchanges code for tokens

  if (!tokens.id_token) return;

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });

  const payload = ticket.getPayload();
  if (payload && payload.email_verified) {
    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  }
};

export const verifyPriceyToken = async (token?: string, secret?: string) => {
  if (!token || !secret) return;

  if (token === process.env.MASTER_KEY) {
    const userInfo = await getUserByEmail(process.env.MASTER_TEST_EMAIL);
    return { payload: { userId: userInfo?.publicId } };
  }
  const encodedSecret = new TextEncoder().encode(secret);

  try {
    return await jwtVerify<JwtPayload>(token, encodedSecret);
  } catch (error) {
    throw new Error(
      "Error authenticating user, invalid or expired accessToken",
      {
        cause: error,
      },
    );
  }
};

export const createTokens = async ({
  userId,
  refreshToken = false,
}: {
  userId: string;
  refreshToken?: boolean;
}) => {
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
    ...(refreshToken && {
      refreshToken: await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(refreshSecret),
    }),
  };
};

/**
 * Login: checks existence of user before returning accessToken; validates Google token
 * Register: creates new user (if error isn't thrown) and returns accessToken
 * userRequired: checks header auth accessToken in any API call (that isn't login/register)
 * */
export const loginCheck = async (idToken?: string) => {
  if (!idToken) return;

  try {
    const verifiedGoogleAccount = await verifyGoogleToken(idToken);

    let fetchedUser = await getUserByEmail(verifiedGoogleAccount?.email);

    // Register a new account
    if (
      !fetchedUser &&
      verifiedGoogleAccount?.email &&
      verifiedGoogleAccount?.name
    ) {
      const [newUser] = await insertUser({
        email: verifiedGoogleAccount?.email || "",
        name: verifiedGoogleAccount?.name || "",
        image: verifiedGoogleAccount?.picture,
      });
      fetchedUser = newUser;
    }

    if (!fetchedUser) return;

    const { publicId, ...userInfo } = fetchedUser;
    const tokens = await createTokens({ userId: publicId, refreshToken: true });
    return {
      tokens,
      userInfo,
    };
  } catch (error) {
    throw new Error("Failed to login", { cause: error });
  }
};

// Need userRequired/refreshRequired and AuthRequest req type to pass req.userId
export const userRequired = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.split("Bearer ")[1];

    if (!token) {
      res.status(401).json({ error: "Missing access token" });
      return;
    }

    const auth = await verifyPriceyToken(token, process.env.JWT_ACCESS_SECRET);
    if (auth) {
      req.userId = auth.payload.userId;
      next();
    } else res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
};

// Separated refreshRequired similar to authRequired for convention, since
export const refreshRequired = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.split("Bearer ")[1];

    if (!token) {
      res.status(401).json({ error: "Missing refresh token" });
      return;
    }

    const auth = await verifyPriceyToken(token, process.env.JWT_REFRESH_SECRET);
    if (auth) {
      req.userId = auth.payload.userId;
      next();
    } else res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.error("refresh token error", error);
    // throw new Error("Unable to authenticate user", { cause: error });
    res.status(401).json({ error: "Invalid or expired refresh token" });
    return;
  }
};
export const setAuthCookies = (
  res: Response,
  accessToken?: string,
  refreshToken?: string,
) => {
  const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
  const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;

  if (accessTokenKey && accessToken)
    res.cookie(accessTokenKey, accessToken, {
      httpOnly: true, // To make it inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Only set true over HTTPS in production
      sameSite: "strict",
      maxAge: 3600000, // 1-hour expiration time
    });

  if (refreshTokenKey && refreshToken)
    res.cookie("pricey_refresh_token", refreshToken, {
      httpOnly: true, // To make it inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Only set true over HTTPS in production
      sameSite: "strict",
      maxAge: 604800000, // 7-day expiration time
    });
};