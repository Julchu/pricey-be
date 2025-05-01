import { db } from "../db";
import { type InsertUser, userTable } from "../db/schemas/user-schema.ts";
import { and, eq } from "drizzle-orm";
import { createToken } from "./auth-handlers.ts";

export const getUser = async (userId: number) => {
  try {
    return await db.select().from(userTable).where(eq(userTable.id, userId));
  } catch (error) {
    throw new Error("Error getting user", { cause: error });
  }
};

const insertUser = async (user: InsertUser) => {
  const { name, email } = user;
  try {
    return await db
      .insert(userTable)
      .values({ name, email })
      .returning({ id: userTable.id });
  } catch (error) {
    throw new Error("Error inserting user", { cause: error });
  }
};

export const updateUser = async (userId: number, updatedUser: InsertUser) => {
  const { email, ...userInfo } = updatedUser;
  try {
    const existingUser = await db.query.userTable.findFirst({
      where: (user) => and(eq(user.id, userId), eq(user.email, email)),
    });

    if (existingUser)
      return await db.update(userTable).set(userInfo).returning();
  } catch (error) {
    throw new Error("Error updating user", { cause: error });
  }
};

export const registerUser = async (user: InsertUser) => {
  try {
    const [createdUser] = await insertUser(user);
    if (createdUser) return await createToken(createdUser.id);
  } catch (error) {
    throw new Error("Error registering new user", { cause: error });
  }
};