import {
  integer,
  numeric,
  pgEnum,
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
import { userTable } from "./user-schema.ts";
import { SeasonValues, UnitValues } from "../../utils/interfaces.ts";

export const unitEnum = pgEnum("unit", UnitValues);
export const seasonEnum = pgEnum("season", ...[SeasonValues]);

export const ingredientTable = pgTable(
  "ingredients",
  {
    ...requiredColumns,
    name: varchar({ length: 255 }).notNull(),
    userId: integer("user_id")
      .references(() => userTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    price: integer(),
    capacity: numeric({ scale: 3, mode: "number" }),
    quantity: integer(),
    unit: unitEnum(),
    image: varchar({ length: 255 }),
    season: seasonEnum(),
    ...timestamps,
  },
  (table) => [
    unique("unique_ingredients").on(table.id),
    unique("unique_userId_ingredientName").on(table.userId, table.name),
  ],
);

export type SelectIngredient = InferSelectModel<typeof ingredientTable>;
export type InsertIngredient = InferInsertModel<typeof ingredientTable>;
export type SelectPublicIngredient = Omit<SelectIngredient, PrivateFields>;
export type InsertPublicIngredient = Omit<InsertIngredient, PrivateFormFields>;

// Foreign key (userId) is not created if checks are added (even if foreign key is added as a constraint rather than in-line)
/*    // check(
    //   "price_gt_0",
    //   sql`${table.price}
    //   > 0`,
    // ),
    // check(
    //   "capacity_gt_0",
    //   sql`${table.capacity}
    //   > 0`,
    // ),
    // check(
    //   "quantity_gt_0",
    //   sql`${table.quantity}
    //   > 0`,
    // ),*/