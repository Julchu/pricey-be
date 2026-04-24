import {
  integer,
  numeric,
  pgTable,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import {
  type PrivateFields,
  type PrivateFormFields,
  requiredColumns,
  timestamps,
} from "../utils/shared-schema.ts";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { ingredientTable, unitEnum } from "./ingredient-schema.ts";
import { recipeTable } from "./recipe-schema.ts";

// TODO: frontend dropdown to select similar ingredient from master list to get price (and set ingredientId)
export const recipeIngredientTable = pgTable(
  "recipe_ingredients",
  {
    ...requiredColumns,
    recipeId: integer("recipe_id")
      .references(() => recipeTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    ingredientId: integer("ingredient_id")
      .references(() => ingredientTable.id, {
        onDelete: "set null",
      })
      .notNull(),
    capacity: numeric({ scale: 3, mode: "number" }),
    quantity: integer(),
    unit: unitEnum(),
    image: varchar({ length: 255 }),
    ...timestamps,
  },
  (table) => [
    unique("unique_recipeIngredients").on(table.publicId),
    unique("unique_recipeId_ingredientId").on(
      table.recipeId,
      table.ingredientId,
    ),
  ],
);

export type SelectRecipeIngredient = InferSelectModel<
  typeof recipeIngredientTable
>;

export type InsertRecipeIngredient = InferInsertModel<
  typeof recipeIngredientTable
>;

export type SelectPublicRecipeIngredient = Omit<
  SelectRecipeIngredient,
  PrivateFields
>;

export type InsertPublicRecipeIngredient = Omit<
  InsertRecipeIngredient,
  PrivateFormFields
>;