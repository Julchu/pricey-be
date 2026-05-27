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
    // TODO: test publicId filtering (what happens if not included in form submission data, or if included but removing publicId validator)
    publicId: z.string().optional(),
  }),
});

export type InsertIngredientInput = z.infer<typeof insertIngredientSchema>;