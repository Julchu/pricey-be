import { integer, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
// TODO: maybe remove default now from updated (do we care at all about updatedAt or deletedAt?)
// TODO: run migration
export const timestamps = {
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
};

export const requiredColumns = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  publicId: uuid("public_id").defaultRandom().notNull(),
  name: varchar({ length: 255 }).notNull(),
};

export type PrivateFields = "id" | "userId";

export type PrivateFormFields = "id" | "userId"; //| "publicId";