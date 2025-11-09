import type { Request } from "express";
import type { SelectGroceryListIngredient } from "../db/schemas/grocery-list-ingredient-schema.ts";

export const Unit = {
  // Mass
  KILOGRAM: "kg",
  POUND: "lb",

  // Volume
  LITRE: "L",
  QUART: "qt",
  CUP: "cup",
  TABLESPOON: "tbsp",
  TEASPOON: "tsp",

  ITEM: "item",
} as const;

export const UnitValues = [
  Unit.KILOGRAM,
  Unit.POUND,
  Unit.LITRE,
  Unit.QUART,
  Unit.CUP,
  Unit.TABLESPOON,
  Unit.TEASPOON,
  Unit.ITEM,
] as const;
export const MassValues = [Unit.KILOGRAM, Unit.POUND] as const;
export const VolumeValues = [Unit.LITRE, Unit.QUART] as const;

export type UnitType = (typeof UnitValues)[number]; // "kg" | "lb" | "L" | "qt" | "cup" | "tbsp" | "tsp" | "item";
export type MassType = (typeof MassValues)[number]; // "kg" | "lb"
export type VolumeType = (typeof VolumeValues)[number]; // "L" | "qt"

export type UnitCategory = {
  mass: MassType;
  volume: VolumeType;
};

export const Color = {
  LIGHT: "light",
  DARK: "dark",
} as const;
export const ColorValues = [Color.LIGHT, Color.DARK] as const;
export type ColorMode = (typeof ColorValues)[number];

export const Season = {
  SPRING: "spring",
  WINTER: "winter",
  SUMMER: "summer",
  FALL: "fall",
} as const;

export const SeasonValues = [
  Season.SPRING,
  Season.WINTER,
  Season.SUMMER,
  Season.FALL,
] as const;
export type SeasonType = (typeof SeasonValues)[number];

export const Role = {
  admin: "admin",
  standard: "standard",
};
export const RoleValues = [Role.admin, Role.standard];
export type RoleType = (typeof RoleValues)[number];

// Public user data (aka not private auth data)
export interface User {
  id: number;
  email: string;
  image?: string;
  name?: string;
  location?: Address;
  preferences?: UserPreferences;
}

/**
 * @param: prefered units
 * @param: dark/light mode
 * @param: display name
 * @param: publically viewable grocery list profile */
export type UserPreferences = {
  units?: UnitCategory;
  colorMode?: ColorMode;
  displayName?: string;
};

export interface Ingredient {
  id: number;
  publicId: string;
  name: string;
  userId: string;
  price: number;
  capacity: number;
  quantity?: number;
  unit: UnitType;
  image?: string;
  season?: SeasonType;
}

export interface GroceryList {
  id: number;
  publicId: string;
  name: string;
  ingredients: SelectGroceryListIngredient[];
  userId: string;
  public?: boolean;
}

export type Recipe = {
  id: number;
  name: string;
  ingredients: Ingredient[];
  userId: string;
  public?: boolean;
};

export type OmitType = Omit<GroceryList, "name">;

/* TODO: create Time-to-live (TTL) grocery list w/ ingredients */

/* Logged in user features:
 * Save grocery list
 * Save price thresholds per ingredient
 *
 */

/* TODO: ask user if they want to save address of lowest ingredient
 * City, province/state, country
 */
export interface Address {
  locality: string;
  administrative_area_level_1: string;
  country: string;
}

/* Auth request parameters
 * TParams: route params; /:recipeId
 * TResBody: response body
 * TReqBody: request body
 * TQuery: url query params; ?recipeId=recipeId
 */
export type AuthRequest<
  TParams = Record<string, unknown>,
  TResBody = unknown,
  TReqBody = unknown,
  TQuery = Record<string, unknown>,
> = Request<TParams, TResBody, TReqBody, TQuery> & {
  userId?: string;
};