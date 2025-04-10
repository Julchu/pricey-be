import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/shared-schema.ts";

export const ingredientTable = pgTable("ingredient", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  price: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  ...timestamps,
});