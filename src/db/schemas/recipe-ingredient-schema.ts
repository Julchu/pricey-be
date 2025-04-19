import {
  integer,
  numeric,
  pgTable,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { requiredColumns, timestamps } from "../utils/shared-schema.ts";
import { userTable } from "./user-schema.ts";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { unitEnum } from "./ingredient-schema.ts";
import { recipeTable } from "./recipe-schema.ts";

export const recipeIngredientTable = pgTable(
  "recipe_ingredients",
  {
    ...requiredColumns,
    userId: integer()
      .references(() => userTable.id, { onDelete: "cascade" })
      .notNull(),
    recipeId: integer()
      .references(() => recipeTable.id, { onDelete: "cascade" })
      .notNull(),
    capacity: numeric({ scale: 3, mode: "number" }).default(1),
    quantity: integer().default(1),
    unit: unitEnum(),
    image: varchar({ length: 255 }),
    ...timestamps,
  },
  (table) => [
    unique("unique_userId_recipeId_ingredientName").on(
      table.userId,
      table.recipeId,
      table.name,
    ),
  ],
);

export type SelectRecipeIngredient = InferSelectModel<
  typeof recipeIngredientTable
>;
export type InsertRecipeIngredient = InferInsertModel<
  typeof recipeIngredientTable
>;