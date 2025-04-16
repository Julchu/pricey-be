import {
  check,
  integer,
  numeric,
  pgEnum,
  pgTable,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { requiredColumns, timestamps } from "../utils/shared-schema.ts";
import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import { userTable } from "./user-schema.ts";
import { Season, Unit } from "../../utils/interfaces.ts";

export const unitEnum = pgEnum("unit", [
  Unit.KILOGRAM,
  Unit.POUND,
  Unit.LITRE,
  Unit.QUART,
  Unit.CUP,
  Unit.TABLESPOON,
  Unit.TEASPOON,
  Unit.ITEM,
]);

export const seasonEnum = pgEnum("season", [
  Season.SPRING,
  Season.WINTER,
  Season.SUMMER,
  Season.FALL,
]);

export const ingredientTable = pgTable(
  "ingredient",
  {
    ...requiredColumns,
    userId: integer()
      .references(() => userTable.id)
      .notNull(),
    price: integer().default(100).notNull(),
    capacity: numeric({ scale: 3, mode: "number" }).default(1).notNull(),
    quantity: integer().default(1),
    unit: unitEnum().notNull(),
    image: varchar({ length: 255 }),
    season: seasonEnum(),
    ...timestamps,
  },
  (table) => [
    check(
      "price_gt_0",
      sql`${table.price}
      > 0`,
    ),
    check(
      "capacity_gt_0",
      sql`${table.capacity}
      > 0`,
    ),
    check(
      "quantity_gt_0",
      sql`${table.quantity}
      > 0`,
    ),
    unique("unique_userId_ingredientName").on(table.userId, table.name),
  ],
);

export type SelectIngredient = InferSelectModel<typeof ingredientTable>;
export type InsertIngredient = InferInsertModel<typeof ingredientTable>;

export const tempIngredients: InsertIngredient[] = [
  {
    name: "Olive Oil",
    price: 1000,
    unit: Unit.LITRE,
    image: "https://example.com/olive_oil.jpg",
    capacity: 1,
    quantity: 2,
    userId: 1,
  },
  {
    name: "Basil",
    price: 150,
    unit: Unit.ITEM,
    image: "https://example.com/basil.jpg",
    capacity: 3,
    quantity: 1,
    userId: 2,
    season: Season.SPRING,
  },
  {
    name: "Chicken Breast",
    price: 700,
    unit: Unit.KILOGRAM,
    image: "https://example.com/chicken.jpg",
    capacity: 2,
    quantity: 1,
    userId: 3,
  },
  {
    name: "Garlic",
    price: 300,
    unit: Unit.KILOGRAM,
    image: "https://example.com/garlic.jpg",
    capacity: 2,
    quantity: 1,
    userId: 4,
  },
  {
    name: "Tomato",
    price: 250,
    unit: Unit.KILOGRAM,
    image: "https://example.com/tomato.jpg",
    capacity: 5,
    quantity: 2,
    userId: 5,
    season: Season.SUMMER,
  },
];