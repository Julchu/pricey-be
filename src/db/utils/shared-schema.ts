import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const timestamps = {
  updated_at: timestamp()
    .$onUpdate(() => new Date())
    .notNull(),
  created_at: timestamp().defaultNow(),
  deleted_at: timestamp(),
};

export const requiredColumns = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
};