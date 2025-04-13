import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { requiredColumns, timestamps } from "../utils/shared-schema.ts";
import { ingredientTable } from "./ingredient-schema.ts";
import { userTable } from "./user-schema.ts";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const recipeTable = pgTable("recipe", {
  ...requiredColumns,
  name: varchar({ length: 255 }).notNull(),
  ingredients: integer()
    .references(() => ingredientTable.id)
    .array()
    .default([]),
  userId: integer()
    .references(() => userTable.id)
    .notNull(),
  public: boolean().default(false),
  ...timestamps,
});

export type SelectRecipe = InferSelectModel<typeof recipeTable>;
export type InsertRecipe = InferInsertModel<typeof recipeTable>;