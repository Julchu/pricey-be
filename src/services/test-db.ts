import { eq } from "drizzle-orm";
import { userTable } from "../db/schemas/user-schema.ts";
import { db } from "../db";

export const testDb = async () => {
  const user: typeof userTable.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };

  await db.insert(userTable).values(user);
  console.log("New user created!");

  const users = await db.select().from(userTable);
  console.log("Getting all users from the database: ", users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  await db
    .update(userTable)
    .set({
      age: 31,
    })
    .where(eq(userTable.email, user.email));
  console.log("User info updated!");

  await db.delete(userTable).where(eq(userTable.email, user.email));
  console.log("User deleted!");
};