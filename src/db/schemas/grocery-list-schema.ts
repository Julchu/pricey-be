import { boolean, integer, pgTable, unique } from "drizzle-orm/pg-core";
import { requiredColumns, timestamps } from "../utils/shared-schema.ts";
import { userTable } from "./user-schema.ts";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const groceryListTable = pgTable(
  "grocery_lists",
  {
    ...requiredColumns,
    userId: integer()
      .references(() => userTable.id, { onDelete: "cascade" })
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