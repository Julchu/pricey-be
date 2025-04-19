import { jsonb, pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { requiredColumns, timestamps } from "../utils/shared-schema.ts";
import { Color, Unit, type UserPreferences } from "../../utils/interfaces.ts";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const userTable = pgTable(
  "users",
  {
    ...requiredColumns,
    email: varchar({ length: 255 }).unique().notNull(),
    image: varchar({ length: 255 }),
    preferences: jsonb()
      .$type<UserPreferences>()
      .default({
        units: {
          mass: Unit.KILOGRAM,
          volume: Unit.LITRE,
        },
        colorMode: Color.DARK,
        displayName: "",
      })
      .notNull(),
    ...timestamps,
  },
  (table) => [unique("unique_userEmail").on(table.email)],
);

export type SelectUser = InferSelectModel<typeof userTable>;
export type InsertUser = InferInsertModel<typeof userTable>;