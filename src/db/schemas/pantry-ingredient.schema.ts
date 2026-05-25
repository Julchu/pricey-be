import { integer, numeric, pgTable, unique } from "drizzle-orm/pg-core";
import {
  type AutomaticFields,
  type PrivateFields,
  requiredColumns,
  timestamps,
} from "../utils/shared-schema";
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { ingredientTable, unitEnum } from "./ingredient.schema";
import { userTable } from "./user.schema.ts";

export const pantryIngredientTable = pgTable(
  "pantry_ingredients",
  {
    ...requiredColumns,
    userId: integer("user_id")
      .references(() => userTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    ingredientId: integer("ingredient_id")
      .references(() => ingredientTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    capacity: numeric({ scale: 3, mode: "number" }),
    quantity: integer(),
    unit: unitEnum(),
    ...timestamps,
  },
  (table) => [
    unique("unique_pantryIngredients").on(table.publicId),
    unique("unique_userId_ingredientId").on(table.userId, table.ingredientId),
  ],
);

export type SelectPantryIngredient = InferSelectModel<
  typeof pantryIngredientTable
>;

export type InsertPantryIngredient = InferInsertModel<
  typeof pantryIngredientTable
>;

export type SelectPublicPantryIngredient = Omit<
  SelectPantryIngredient,
  PrivateFields
> & { ingredientPublicId: string; name: string };

export type InsertPublicPantryIngredient = Omit<
  InsertPantryIngredient,
  PrivateFields | AutomaticFields
> & { ingredientPublicId: string };