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
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { groceryListTable } from "./grocery-list-schema.ts";
import { ingredientTable, unitEnum } from "./ingredient-schema.ts";

export const groceryListIngredientTable = pgTable(
  "grocery_list_ingredients",
  {
    ...requiredColumns,
    groceryListId: integer("grocery_list_id")
      .references(() => groceryListTable.id, { onDelete: "cascade" })
      .notNull(),
    ingredientId: integer("ingredient_id")
      .references(() => ingredientTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    capacity: numeric({ scale: 3, mode: "number" }),
    quantity: integer(),
    unit: unitEnum(),
    image: varchar({ length: 255 }),
    ...timestamps,
  },
  (table) => [
    unique("unique_groceryListIngredients").on(table.publicId),
    unique("unique_groceryListId_ingredientId").on(
      table.groceryListId,
      table.ingredientId,
    ),
  ],
);

export type SelectGroceryListIngredient = InferSelectModel<
  typeof groceryListIngredientTable
>;

export type InsertGroceryListIngredient = InferInsertModel<
  typeof groceryListIngredientTable
>;

export type SelectPublicGroceryListIngredient = Omit<
  SelectGroceryListIngredient,
  PrivateFields | "groceryListId"
>;

export type InsertPublicGroceryListIngredient = Omit<
  InsertGroceryListIngredient,
  PrivateFormFields | "groceryListId"
>;

export type SeedGroceryListIngredient = Omit<InsertGroceryListIngredient, "">;