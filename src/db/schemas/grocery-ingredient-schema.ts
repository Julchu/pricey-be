import {
  integer,
  numeric,
  pgTable,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { requiredColumns, timestamps } from "../utils/shared-schema.ts";
import { userTable } from "./user-schema.ts";
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { groceryListTable } from "./grocery-list-schema.ts";
import { unitEnum } from "./ingredient-schema.ts";

export const groceryListIngredientTable = pgTable(
  "grocery_list_ingredients",
  {
    ...requiredColumns,
    userId: integer()
      .references(() => userTable.id, { onDelete: "cascade" })
      .notNull(),
    groceryListId: integer()
      .references(() => groceryListTable.id, { onDelete: "cascade" })
      .notNull(),
    capacity: numeric({ scale: 3, mode: "number" }).default(1),
    quantity: integer().default(1),
    unit: unitEnum(),
    image: varchar({ length: 255 }),
    ...timestamps,
  },
  (table) => [
    unique("unique_userId_groceryListId_ingredientName").on(
      table.userId,
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