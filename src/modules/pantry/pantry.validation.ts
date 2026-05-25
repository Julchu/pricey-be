import { z } from "zod";
import { UnitValues } from "../../types";

const pantryIngredientSchema = z.object({
  ingredientPublicId: z.string().uuid(),
  capacity: z.number().positive().optional(),
  quantity: z.number().int().positive().optional(),
  unit: z.enum([...UnitValues]).optional(),
});

const pantryIngredientWithPublicIdSchema = pantryIngredientSchema.extend({
  publicId: z.string().uuid(),
});

export const getPantrySchema = z.object({});

export const batchUpdatePantrySchema = z.object({
  newIngredients: z.array(pantryIngredientSchema).default([]),
  updatedIngredients: z.array(pantryIngredientWithPublicIdSchema).default([]),
  deletedIngredientIds: z.array(z.string().uuid()).default([]),
});

export type BatchUpdatePantryInput = z.infer<typeof batchUpdatePantrySchema>;
