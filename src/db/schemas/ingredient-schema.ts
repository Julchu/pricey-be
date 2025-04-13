import {
  check,
  integer,
  numeric,
  pgEnum,
  pgTable,
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
    name: varchar({ length: 255 }).notNull(),
    userId: integer().references(() => userTable.id),
    price: integer().default(100),
    capacity: numeric({ scale: 3, mode: "number" }).default(1),
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
  ],
);

export type SelectIngredient = InferSelectModel<typeof ingredientTable>;
export type InsertIngredient = InferInsertModel<typeof ingredientTable>;