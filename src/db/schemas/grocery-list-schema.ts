import { boolean, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { requiredColumns, timestamps } from "../utils/shared-schema.ts";
import { userTable } from "./user-schema.ts";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const groceryListTable = pgTable(
  "grocery_lists",
  {
    ...requiredColumns,
    userId: uuid("user_id")
      .references(() => userTable.publicId, { onDelete: "cascade" })
      .notNull(),
    public: boolean().default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    unique("unique_groceryLists").on(table.publicId),
    unique("unique_userId_groceryListName").on(table.userId, table.name),
  ],
);

export type SelectGroceryList = InferSelectModel<typeof groceryListTable>;
export type InsertGroceryList = InferInsertModel<typeof groceryListTable>;