import { db } from "../db";
import { and, eq } from "drizzle-orm";
import {
  groceryListTable,
  type InsertGroceryList,
  type InsertPublicGroceryList,
} from "../db/schemas/grocery-list-schema.ts";
import {
  groceryListIngredientTable,
  type InsertGroceryListIngredient,
  type InsertPublicGroceryListIngredient,
} from "../db/schemas/grocery-list-ingredient-schema.ts"; // TODO: determine if upsert vs insert/update & removing schema unique conflict

// TODO: determine if upsert vs insert/update & removing schema unique conflict
// TODO: test if insert accounts for uniqueness (can insert same name/list/userId ingredient, or if blocked)
export const insertGroceryList = async (
  groceryList: InsertPublicGroceryList,
  groceryListIngredients: InsertPublicGroceryListIngredient[] = [],
  userId: string,
) => {
  const insertGroceryList: InsertGroceryList = {
    ...groceryList,
    name: groceryList.name.toLowerCase(),
    userId,
  };

  try {
    return await db.transaction(async (tx) => {
      const insertedGroceryList = await tx
        .insert(groceryListTable)
        .values(insertGroceryList)
        .onConflictDoUpdate({
          target: [groceryListTable.userId, groceryListTable.name],
          set: insertGroceryList,
        })
        .returning();

      const groceryListId = insertedGroceryList[0]?.publicId;

      if (groceryListId && groceryListIngredients.length > 0) {
        const insertGroceryListIngredients: InsertGroceryListIngredient[] =
          groceryListIngredients.map((ingredient) => {
            return {
              ...ingredient,
              name: ingredient.name.toLowerCase(),
              quantity: ingredient.quantity || 1,
              userId,
              groceryListId: groceryListId,
            };
          });

        const insertedGroceryListIngredients = await tx
          .insert(groceryListIngredientTable)
          .values(insertGroceryListIngredients)
          .returning();

        return {
          ...insertedGroceryList[0],
          ingredients: insertedGroceryListIngredients,
        };
      } else {
        console.error(
          `Error inserting grocery list ingredients for ${groceryListId}`,
        );
      }
      return insertedGroceryList;
    });
  } catch (error) {
    throw new Error("Error inserting grocery list", { cause: error });
  }
};

// Note: how to account for updated ingredient list?
// Would need to diff groceryList ingredients and remove unused ingredients
// export const updateGroceryList = async (
//   groceryList: InsertGroceryList,
//   groceryListIngredients: InsertPublicGroceryListIngredient[],
// ) => {
//   try {
//     return await db.transaction(async (tx) => {
//       await tx
//         .delete(groceryListIngredientTable)
//         .where(eq(groceryListIngredientTable.groceryListId, groceryList.publicId));
//       const insertedGroceryList = await tx
//         .insert(groceryListTable)
//         .values(insertGroceryList)
//         .onConflictDoUpdate({
//           target: [
//             groceryListTable.userId,
//             groceryListTable.name,
//             groceryListTable.publicId,
//           ],
//           set: insertGroceryList,
//         })
//         .returning();
//
//       await tx.insert(groceryListTable).values(groceryList).returning();
//       for (const ingredient of groceryListIngredients) {
//         await tx.update(groceryListIngredientTable).set(ingredient).returning();
//       }
//     });
//     //   TODO: update grocery list ingredients
//   } catch (error) {
//     throw new Error("Error updating grocery list", { cause: error });
//   }
// };

export const getAllGroceryLists = async (userId: string) => {
  try {
    return await db
      .select()
      .from(groceryListTable)
      .where(eq(groceryListTable.userId, userId));
    //   get grocery ingredients and combine with list
  } catch (error) {
    throw new Error("Error getting grocery list", { cause: error });
  }
};

export const getGroceryList = async (groceryListId: string, userId: string) => {
  try {
    return await db
      .select()
      .from(groceryListTable)
      .where(
        and(
          eq(groceryListTable.publicId, groceryListId),
          eq(groceryListTable.userId, userId),
        ),
      );
  } catch (error) {
    throw new Error("Error getting groceryList:", { cause: error });
  }
};