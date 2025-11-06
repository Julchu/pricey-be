import { boolean, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { requiredColumns, timestamps } from "../utils/shared-schema.ts";
import { userTable } from "./user-schema.ts";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const recipeTable = pgTable(
  "recipes",
  {
    ...requiredColumns,
    userId: uuid("user_id")
      .references(() => userTable.publicId, { onDelete: "cascade" })
      .notNull(),
    public: boolean().default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    unique("unique_recipes").on(table.publicId),
    unique("unique_userId_recipeName").on(table.userId, table.name),
  ],
);

export type SelectRecipe = InferSelectModel<typeof recipeTable>;
export type InsertRecipe = InferInsertModel<typeof recipeTable>;