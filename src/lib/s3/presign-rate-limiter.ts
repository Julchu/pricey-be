import rateLimit from "express-rate-limit";
import type { AuthRequest } from "../../types";

// Scoped rate limiter for presign endpoints, on top of the app-wide limiter
// in app.ts. Keyed by userId (not IP) since these are protected routes --
// this limits how many upload slots a single user can request, independent
// of how many people share an IP/NAT.
export const presignRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // 20 presign requests per user per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req: AuthRequest) => String(req.userId ?? req.ip ?? ""),
});
