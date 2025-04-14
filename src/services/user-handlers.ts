import { db } from "../db";
import { eq } from "drizzle-orm";
import {
  type InsertUser,
  tempUsers,
  userTable,
} from "../db/schemas/user-schema.ts";

export const upsertUser = async (user: InsertUser) => {
  try {
    return await db
      .insert(userTable)
      .values(user)
      .onConflictDoUpdate({
        target: [userTable.id, userTable.email],
        set: user,
      });
  } catch (error) {
    console.log("Error upserting user:", error);
    throw error;
  }
};

export const updateUser = async (user: InsertUser) => {
  try {
    await db
      .update(userTable)
      .set(user)
      .where(eq(userTable.name, "Dan"))
      .returning({ updatedId: userTable.id });
  } catch (error) {
    console.log("Error updating user:", error);
  }
};

export const insertTempUsers = () => {
  return db.insert(userTable).values(tempUsers).returning();
};