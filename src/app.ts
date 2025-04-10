import createError, { HttpError } from "http-errors";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { indexRouter } from "./routes/index-router.ts";
import { ingredientRouter } from "./routes/ingredient-router.ts";

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

app.use("/", indexRouter);
app.use("/ingredient", ingredientRouter);

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