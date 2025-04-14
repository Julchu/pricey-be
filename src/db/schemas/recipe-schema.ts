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

export const tempRecipes: InsertRecipe[] = [
  {
    name: "Spaghetti Bolognese",
    ingredients: [1, 2, 3],
    userId: 1,
    public: true,
  },
  {
    name: "Chicken Curry",
    ingredients: [4, 5, 6],
    userId: 2,
    public: true,
  },
  {
    name: "Vegetable Stir Fry",
    ingredients: [7, 8, 9],
    userId: 3,
    public: false,
  },
  {
    name: "Beef Tacos",
    ingredients: [10, 11, 12],
    userId: 1,
    public: true,
  },
  {
    name: "Quinoa Salad",
    ingredients: [13, 14],
    userId: 2,
    public: false,
  },
];