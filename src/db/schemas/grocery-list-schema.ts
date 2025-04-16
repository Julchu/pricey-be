import { boolean, integer, pgTable, unique } from "drizzle-orm/pg-core";
import { requiredColumns, timestamps } from "../utils/shared-schema.ts";
import { userTable } from "./user-schema.ts";
import { ingredientTable } from "./ingredient-schema.ts";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const groceryListTable = pgTable(
  "grocery_list",
  {
    ...requiredColumns,
    ingredients: integer()
      .references(() => ingredientTable.id)
      .array()
      .default([])
      .notNull(),
    userId: integer()
      .references(() => userTable.id)
      .notNull(),
    public: boolean().default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    unique("unique_userId_groceryListName").on(table.userId, table.name),
  ],
);

export type SelectGroceryList = InferSelectModel<typeof groceryListTable>;
export type InsertGroceryList = InferInsertModel<typeof groceryListTable>;

export const tempGroceryLists: InsertGroceryList[] = [
  {
    name: "Weekly Essentials",
    ingredients: [1, 2, 3], // ingredient IDs
    userId: 1,
    public: true,
  },
  {
    name: "BBQ Party",
    ingredients: [4, 5, 6, 7],
    userId: 2,
    public: false,
  },
  {
    name: "Vegan Meals",
    ingredients: [8, 9],
    userId: 3,
    public: true,
  },
  {
    name: "Baking Basics",
    ingredients: [10, 11, 12],
    userId: 1,
    public: false,
  },
  {
    name: "Holiday Dinner",
    ingredients: [13, 14, 15, 16],
    userId: 4,
    public: true,
  },
];