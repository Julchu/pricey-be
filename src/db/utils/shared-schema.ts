import { integer, timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
  created_at: timestamp().defaultNow(),
  deleted_at: timestamp(),
};

export const requiredColumns = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
};