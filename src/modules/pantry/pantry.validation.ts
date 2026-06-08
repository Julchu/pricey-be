import { z } from "zod";
import { UnitValues } from "../../types";

const pantryIngredientSchema = z.object({
  ingredientPublicId: z.string().uuid(),
  capacity: z.number().positive().optional().nullable(),
  quantity: z.number().int().positive().optional().nullable(),
  unit: z.enum([...UnitValues]).optional(),
  publicId: z.string().uuid().optional(),
});

const pantryIngredientWithPublicIdSchema = pantryIngredientSchema.extend({
  publicId: z.string().uuid(),
});

export const batchUpdatePantrySchema = z.object({
  newIngredients: z.array(pantryIngredientSchema).default([]),
  updatedIngredients: z.array(pantryIngredientWithPublicIdSchema).default([]),
  deletedIngredientIds: z.array(z.string().uuid()).default([]),
});

export type BatchUpdatePantryInput = z.infer<typeof batchUpdatePantrySchema>;