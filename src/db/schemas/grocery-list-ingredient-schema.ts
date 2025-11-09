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
import { unitEnum } from "./ingredient-schema.ts";

export const groceryListIngredientTable = pgTable(
  "grocery_list_ingredients",
  {
    ...requiredColumns,
    groceryListId: integer("grocery_list_id")
      .references(() => groceryListTable.id, { onDelete: "cascade" })
      .notNull(),
    capacity: numeric({ scale: 3, mode: "number" }).default(1),
    quantity: integer().default(1),
    unit: unitEnum(),
    image: varchar({ length: 255 }),
    ...timestamps,
  },
  (table) => [
    unique("unique_groceryListIngredients").on(table.publicId),
    unique("unique_groceryListId_ingredientName").on(
      table.groceryListId,
      table.name,
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
  PrivateFields
>;

export type InsertPublicGroceryListIngredient = Omit<
  InsertGroceryListIngredient,
  PrivateFormFields
>;

export type SeedGroceryListIngredient = Omit<InsertGroceryListIngredient, "">;