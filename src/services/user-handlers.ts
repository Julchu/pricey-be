import { db } from "../db";
import { type InsertUser, userTable } from "../db/schemas/user-schema.ts";
import { eq } from "drizzle-orm";

export const getUser = async (userId: number) => {
  try {
    return await db.select().from(userTable).where(eq(userTable.id, userId));
  } catch (error) {
    throw new Error("Error getting user", { cause: error });
  }
};

export const insertUser = async (user: InsertUser) => {
  try {
    return await db.insert(userTable).values(user).returning();
  } catch (error) {
    throw new Error("Error upserting user", { cause: error });
  }
};

export const updateUser = async (userId: number, updatedUser: InsertUser) => {
  // const existingUser = await db.query.userTable.findFirst({
  //   where: (user) => eq(user.id, userId),
  // });
  //
  // if (existingUser)
  try {
    return await db.update(userTable).set(updatedUser).returning();
  } catch (error) {
    throw new Error("Error upserting user", { cause: error });
  }
};