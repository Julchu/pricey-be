import createError, { HttpError } from "http-errors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { seedingRouter } from "./modules/testing/seeding.routes.ts";
import { ingredientRouter } from "./modules/ingredient/ingredient.routes.ts";
import { userRouter } from "./modules/user/user.routes.ts";
import { groceryListRouter } from "./modules/grocery-list/grocery-list.routes.ts";
import { recipeRouter } from "./modules/recipe/recipe.routes.ts";
import { pantryRouter } from "./modules/pantry/pantry.routes.ts";
import rateLimit from "express-rate-limit";
import { userSetter } from "./lib/auth/auth-handlers.ts";

const app = express();

// view engine setup
const __dirname = import.meta.dirname;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// TODO: test/optimize rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  keyGenerator: (req) => {
    if (!req.headers.authorization) return "1";
    return req.ip || "";
  },
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

// Public routes
app.use("/", seedingRouter);
app.use("/user", userRouter);

// Protected routes
const protectedRoutes = express.Router();

protectedRoutes.use(userSetter);
protectedRoutes.use("/ingredient", ingredientRouter);
protectedRoutes.use("/grocery-list", groceryListRouter);
protectedRoutes.use("/recipe", recipeRouter);
protectedRoutes.use("/pantry", pantryRouter);

app.use("/", protectedRoutes);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;