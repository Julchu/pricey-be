import { db } from "../db";
import { type InsertUser, userTable } from "../db/schemas/user-schema.ts";
import { eq } from "drizzle-orm";

export const upsertUser = async (user: InsertUser) => {
  try {
    return await db.insert(userTable).values(user).returning();
  } catch (error) {
    console.log("Error upserting user:", error);
    throw error;
  }
};

export const getUser = async (userId: number) => {
  try {
    return await db.select().from(userTable).where(eq(userTable.id, userId));
  } catch (error) {
    console.log("Error getting groceryList:", error);
  }
};