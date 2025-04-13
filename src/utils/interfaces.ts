export enum Unit {
  // Mass
  KILOGRAM = "kg",
  POUND = "lb",

  // Volume
  LITRE = "L",
  QUART = "qt",
  CUP = "cup",
  TABLESPOON = "tbsp",
  TEASPOON = "tsp",

  ITEM = "item",
}

export type UnitType = MassType | LiquidType | OtherType;

export type OtherType = Unit.ITEM | Unit.CUP | Unit.TABLESPOON | Unit.TEASPOON;

export type MassType = Unit.KILOGRAM | Unit.POUND;

export type LiquidType = Unit.LITRE | Unit.QUART;

export type UnitCategory = {
  mass: MassType;
  volume: LiquidType;
};

export enum Color {
  LIGHT = "light",
  DARK = "dark",
}

export type ColorMode = Color.LIGHT | Color.DARK;

export enum Season {
  SPRING = "spring",
  WINTER = "winter",
  SUMMER = "summer",
  FALL = "fall",
}

export enum Role {
  admin = "admin",
  standard = "standard",
}

export interface Ingredient {
  name: string;
  price?: number;
  unit?: Unit;
  image?: string;
  /** @param capacity and @param quantity used for @interfaceGroceryList */
  capacity?: number;
  quantity?: number;
  userId: string;
  season?: Season;
  // createdAt?: Timestamp | FieldValue;
  // lastUpdated?: Timestamp | FieldValue;
}

export const tempIngredientList: Ingredient[] = [
  {
    name: "Tomato",
    price: 2.5,
    unit: Unit.KILOGRAM,
    image: "https://example.com/tomato.jpg",
    capacity: 5,
    quantity: 2,
    userId: "user_123",
    season: Season.SUMMER,
  },
  {
    name: "Olive Oil",
    price: 10,
    unit: Unit.LITRE,
    image: "https://example.com/olive_oil.jpg",
    capacity: 1,
    quantity: 0.5,
    userId: "user_123",
  },
  {
    name: "Basil",
    price: 1.5,
    unit: Unit.ITEM,
    image: "https://example.com/basil.jpg",
    capacity: 3,
    quantity: 1,
    userId: "user_123",
    season: Season.SPRING,
  },
  {
    name: "Chicken Breast",
    price: 7,
    unit: Unit.KILOGRAM,
    image: "https://example.com/chicken.jpg",
    capacity: 2,
    quantity: 1,
    userId: "user_123",
  },
  {
    name: "Garlic",
    price: 3,
    unit: Unit.KILOGRAM,
    image: "https://example.com/garlic.jpg",
    capacity: 2,
    quantity: 1,
    userId: "user_123",
  },
];

export interface PersonalIngredient extends Ingredient {
  price: number;
  unit: Unit;
}

export interface GroceryList {
  name: string;
  ingredients: Ingredient[];
  public?: boolean;
  userId: string;
  // createdAt?: Timestamp | FieldValue;
}

export type Recipe = {
  name: string;
  ingredients: Ingredient[];
  public?: boolean;
  userId: string;
};

export type OmitType = Omit<GroceryList, "name">;

// Public user data (aka not private auth data)
export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  name?: string;
  location?: Address;
  // createdAt?: Timestamp;
  /**
   * @param: prefered units
   * @param: dark/light mode
   * @param: display name
   * @param: publically viewable grocery list profile */
  preferences?: UserPreferences;
}

export type UserPreferences = {
  units?: UnitCategory;
  colorMode?: Color;
  displayName?: string;
};

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