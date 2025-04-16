import { db } from "../db";
import { eq } from "drizzle-orm";
import {
  type InsertUser,
  tempUsers,
  userTable,
} from "../db/schemas/user-schema.ts";

export const upsertUser = async (user: InsertUser) => {
  try {
    return await db.insert(userTable).values(user).returning();
  } catch (error) {
    console.log("Error upserting user:", error);
    throw error;
  }
};

export const updateUser = async (id: number, user: InsertUser) => {
  try {
    await db
      .update(userTable)
      .set(user)
      .where(eq(userTable.id, id))
      .returning({ updatedId: userTable.id });
  } catch (error) {
    console.log("Error updating user:", error);
  }
};

export const insertTempUsers = async () => {
  try {
    return await db.insert(userTable).values(tempUsers).returning();
  } catch (error) {
    console.log("Error inserting temp users:", error);
  }
};