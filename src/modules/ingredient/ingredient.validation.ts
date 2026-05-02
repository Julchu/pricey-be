import { z } from "zod";
import { SeasonValues, UnitValues } from "../../types";

export const insertIngredientSchema = z.object({
  ingredient: z.object({
    name: z.string().min(1),
    price: z.number().optional(),
    capacity: z.number().optional(),
    quantity: z.number().optional(),
    unit: z.enum([...UnitValues]).optional(),
    image: z.string().optional(),
    season: z.enum([...SeasonValues]).optional(),
  }),
});

export type InsertIngredientInput = z.infer<typeof insertIngredientSchema>;
