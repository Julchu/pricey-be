import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/shared-schema.ts";

export const recipeTable = pgTable("recipe", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  ...timestamps,
});