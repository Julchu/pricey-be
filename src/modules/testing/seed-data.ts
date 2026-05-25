import { Color, Season, Unit } from "../../types";
import type { InsertPublicUser } from "../../db/schemas/user.schema";
import type { InsertPublicIngredient } from "../../db/schemas/ingredient.schema";
import type { InsertPublicRecipe } from "../../db/schemas/recipe.schema";
import type { InsertPublicGroceryList } from "../../db/schemas/grocery-list.schema";

// ==================== USER DATA ====================

export const seedUsers: InsertPublicUser[] = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    image: "https://example.com/images/alice.jpg",
    preferences: {
      units: { mass: Unit.KILOGRAM, volume: Unit.LITRE },
      colorMode: Color.LIGHT,
      displayName: "alicej",
    },
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    image: "https://example.com/images/bob.jpg",
    preferences: {
      units: { mass: Unit.POUND, volume: Unit.QUART },
      colorMode: Color.DARK,
      displayName: "bobby",
    },
  },
  {
    name: "Cathy Lee",
    email: "cathy@example.com",
    image: "https://example.com/images/cathy.jpg",
    preferences: {
      units: { mass: Unit.KILOGRAM, volume: Unit.LITRE },
      colorMode: Color.DARK,
      displayName: "cathylee88",
    },
  },
  {
    name: "David Kim",
    email: "david@example.com",
    image: "https://example.com/images/david.jpg",
    preferences: {
      units: { mass: Unit.POUND, volume: Unit.QUART },
      colorMode: Color.LIGHT,
      displayName: "davidk",
    },
  },
  {
    name: "Ella Martinez",
    email: "ella@example.com",
    image: "https://example.com/images/ella.jpg",
    preferences: {
      units: { mass: Unit.KILOGRAM, volume: Unit.LITRE },
      colorMode: Color.LIGHT,
      displayName: "ellam",
    },
  },
  {
    name: "Frank Zhao",
    email: "frank@example.com",
    image: "https://example.com/images/frank.jpg",
    preferences: {
      units: { mass: Unit.POUND, volume: Unit.QUART },
      colorMode: Color.DARK,
      displayName: "frankz",
    },
  },
  {
    name: "Grace Park",
    email: "grace@example.com",
    image: "https://example.com/images/grace.jpg",
    preferences: {
      units: { mass: Unit.KILOGRAM, volume: Unit.LITRE },
      colorMode: Color.DARK,
      displayName: "gracep",
    },
  },
  {
    name: "Henry Chen",
    email: "henry@example.com",
    image: "https://example.com/images/henry.jpg",
    preferences: {
      units: { mass: Unit.POUND, volume: Unit.QUART },
      colorMode: Color.LIGHT,
      displayName: "henrych",
    },
  },
  {
    name: "Isla Nguyen",
    email: "isla@example.com",
    image: "https://example.com/images/isla.jpg",
    preferences: {
      units: { mass: Unit.KILOGRAM, volume: Unit.LITRE },
      colorMode: Color.LIGHT,
      displayName: "islanguyen",
    },
  },
  {
    name: "Jake Rivera",
    email: "jake@example.com",
    image: "https://example.com/images/jake.jpg",
    preferences: {
      units: { mass: Unit.POUND, volume: Unit.QUART },
      colorMode: Color.DARK,
      displayName: "jakester",
    },
  },
  {
    name: "Julian Chu",
    email: process.env.MASTER_TEST_EMAIL || "julian@example.com",
    image: "https://avatars.githubusercontent.com/u/17052350?v=4",
    preferences: {
      units: { mass: Unit.POUND, volume: Unit.QUART },
      colorMode: Color.DARK,
      displayName: "julchu",
    },
  },
];

// ==================== INGREDIENT DATA (userId added at insertion time) ====================

export const seedIngredients: InsertPublicIngredient[] = [
  {
    name: "Olive Oil",
    price: 1000,
    unit: Unit.LITRE,
    image: "https://example.com/olive_oil.jpg",
    capacity: 1,
    quantity: 2,
  },
  {
    name: "Basil",
    price: 150,
    unit: Unit.PIECES,
    image: "https://example.com/basil.jpg",
    capacity: 3,
    quantity: 1,
    season: Season.SPRING,
  },
  {
    name: "Chicken Breast",
    price: 700,
    unit: Unit.KILOGRAM,
    image: "https://example.com/chicken.jpg",
    capacity: 2,
    quantity: 1,
  },
  {
    name: "Garlic",
    price: 300,
    unit: Unit.KILOGRAM,
    image: "https://example.com/garlic.jpg",
    capacity: 2,
    quantity: 1,
  },
  {
    name: "Tomato",
    price: 250,
    unit: Unit.KILOGRAM,
    image: "https://example.com/tomato.jpg",
    capacity: 5,
    quantity: 2,
    season: Season.SUMMER,
  },
  {
    name: "Spaghetti",
    price: 350,
    unit: Unit.PIECES,
    image: "https://example.com/spaghetti.jpg",
    capacity: 1,
    quantity: 3,
  },
  {
    name: "Ground Beef",
    price: 1200,
    unit: Unit.KILOGRAM,
    image: "https://example.com/beef.jpg",
    capacity: 1,
    quantity: 2,
  },
  {
    name: "Onion",
    price: 150,
    unit: Unit.KILOGRAM,
    image: "https://example.com/onion.jpg",
    capacity: 1,
    quantity: 5,
    season: Season.FALL,
  },
  {
    name: "Carrot",
    price: 200,
    unit: Unit.KILOGRAM,
    image: "https://example.com/carrot.jpg",
    capacity: 1,
    quantity: 4,
    season: Season.WINTER,
  },
  {
    name: "Bell Pepper",
    price: 400,
    unit: Unit.PIECES,
    image: "https://example.com/pepper.jpg",
    capacity: 1,
    quantity: 6,
    season: Season.SUMMER,
  },
  {
    name: "Milk",
    price: 500,
    unit: Unit.LITRE,
    image: "https://example.com/milk.jpg",
    capacity: 2,
    quantity: 1,
  },
  {
    name: "Eggs",
    price: 600,
    unit: Unit.PIECES,
    image: "https://example.com/eggs.jpg",
    capacity: 12,
    quantity: 1,
  },
  {
    name: "Flour",
    price: 300,
    unit: Unit.KILOGRAM,
    image: "https://example.com/flour.jpg",
    capacity: 5,
    quantity: 1,
  },
  {
    name: "Sugar",
    price: 250,
    unit: Unit.KILOGRAM,
    image: "https://example.com/sugar.jpg",
    capacity: 2,
    quantity: 1,
  },
  {
    name: "Butter",
    price: 800,
    unit: Unit.PIECES,
    image: "https://example.com/butter.jpg",
    capacity: 1,
    quantity: 2,
  },
];

// ==================== RECIPE DATA (userId added at insertion time) ====================

export const seedRecipes: InsertPublicRecipe[] = [
  { name: "Spaghetti Bolognese", isPublic: true },
  { name: "Chicken Curry", isPublic: true },
  { name: "Vegetable Stir Fry", isPublic: false },
  { name: "Beef Tacos", isPublic: true },
  { name: "Quinoa Salad", isPublic: false },
  { name: "Tomato Basil Soup", isPublic: true },
  { name: "Garlic Butter Chicken", isPublic: false },
  { name: "Beef Stew", isPublic: true },
];

// ==================== GROCERY LIST DATA (userId added at insertion time) ====================

export const seedGroceryLists: InsertPublicGroceryList[] = [
  { name: "Soup", isPublic: true },
  { name: "BBQ Party", isPublic: false },
  { name: "Vegan Meals", isPublic: true },
  { name: "Baking Basics", isPublic: false },
  { name: "Holiday Dinner", isPublic: true },
  { name: "Weekly Shop", isPublic: false },
];

// ==================== RECIPE INGREDIENT DATA ====================
// Maps recipe index (from seedRecipes array) to ingredient data
// name is used to look up the ingredientId after ingredients are inserted

export interface RecipeIngredientSeed {
  name: string;
  capacity?: number;
  quantity?: number;
  unit: (typeof Unit)[keyof typeof Unit];
  image?: string;
}

export const seedRecipeIngredients: Record<number, RecipeIngredientSeed[]> = {
  // Spaghetti Bolognese
  0: [
    {
      name: "Ground Beef",
      capacity: 0.5,
      quantity: 1,
      unit: Unit.KILOGRAM,
    },
    {
      name: "Spaghetti",
      capacity: 1,
      quantity: 1,
      unit: Unit.PIECES,
    },
    { name: "Tomato", capacity: 0.5, quantity: 3, unit: Unit.PIECES },
    { name: "Garlic", capacity: 2, quantity: 1, unit: Unit.PIECES },
    {
      name: "Olive Oil",
      capacity: 2,
      quantity: 1,
      unit: Unit.TABLESPOON,
    },
  ],
  // Chicken Curry
  1: [
    {
      name: "Chicken Breast",
      capacity: 0.5,
      quantity: 2,
      unit: Unit.KILOGRAM,
    },
    { name: "Onion", capacity: 0.5, quantity: 2, unit: Unit.PIECES },
    { name: "Garlic", capacity: 3, quantity: 1, unit: Unit.PIECES },
    { name: "Tomato", capacity: 0.3, quantity: 2, unit: Unit.PIECES },
  ],
  // Vegetable Stir Fry
  2: [
    {
      name: "Bell Pepper",
      capacity: 2,
      quantity: 1,
      unit: Unit.PIECES,
    },
    { name: "Carrot", capacity: 0.5, quantity: 3, unit: Unit.PIECES },
    { name: "Onion", capacity: 1, quantity: 1, unit: Unit.PIECES },
    { name: "Garlic", capacity: 2, quantity: 1, unit: Unit.PIECES },
    {
      name: "Olive Oil",
      capacity: 1,
      quantity: 1,
      unit: Unit.TABLESPOON,
    },
  ],
  // Beef Tacos
  3: [
    {
      name: "Ground Beef",
      capacity: 0.5,
      quantity: 1,
      unit: Unit.KILOGRAM,
    },
    { name: "Onion", capacity: 1, quantity: 1, unit: Unit.PIECES },
    { name: "Tomato", capacity: 0.5, quantity: 2, unit: Unit.PIECES },
  ],
  // Quinoa Salad
  4: [
    {
      name: "Bell Pepper",
      capacity: 1,
      quantity: 2,
      unit: Unit.PIECES,
    },
    { name: "Tomato", capacity: 0.5, quantity: 3, unit: Unit.PIECES },
    {
      name: "Olive Oil",
      capacity: 2,
      quantity: 1,
      unit: Unit.TABLESPOON,
    },
    { name: "Basil", capacity: 5, quantity: 1, unit: Unit.PIECES },
  ],
  // Tomato Basil Soup
  5: [
    { name: "Tomato", capacity: 1, quantity: 6, unit: Unit.PIECES },
    { name: "Basil", capacity: 10, quantity: 1, unit: Unit.PIECES },
    { name: "Garlic", capacity: 3, quantity: 1, unit: Unit.PIECES },
    {
      name: "Olive Oil",
      capacity: 2,
      quantity: 1,
      unit: Unit.TABLESPOON,
    },
    { name: "Onion", capacity: 1, quantity: 1, unit: Unit.PIECES },
  ],
  // Garlic Butter Chicken
  6: [
    {
      name: "Chicken Breast",
      capacity: 0.5,
      quantity: 2,
      unit: Unit.KILOGRAM,
    },
    { name: "Garlic", capacity: 4, quantity: 1, unit: Unit.PIECES },
    { name: "Butter", capacity: 50, quantity: 1, unit: Unit.PIECES },
    {
      name: "Olive Oil",
      capacity: 1,
      quantity: 1,
      unit: Unit.TABLESPOON,
    },
  ],
  // Beef Stew
  7: [
    {
      name: "Ground Beef",
      capacity: 0.5,
      quantity: 1,
      unit: Unit.KILOGRAM,
    },
    { name: "Carrot", capacity: 0.5, quantity: 4, unit: Unit.PIECES },
    { name: "Onion", capacity: 1, quantity: 2, unit: Unit.PIECES },
    { name: "Garlic", capacity: 2, quantity: 1, unit: Unit.PIECES },
    { name: "Tomato", capacity: 0.3, quantity: 2, unit: Unit.PIECES },
  ],
};

// ==================== GROCERY LIST INGREDIENT DATA ====================
// Maps grocery list index (from seedGroceryLists array) to ingredient data

export interface GroceryListIngredientSeed {
  ingredientName: string;
  capacity?: number;
  quantity?: number;
  unit: (typeof Unit)[keyof typeof Unit];
  image?: string;
}

export const seedGroceryListIngredients: Record<
  number,
  GroceryListIngredientSeed[]
> = {
  // Soup
  0: [
    { ingredientName: "Carrot", capacity: 1, quantity: 5, unit: Unit.PIECES },
    { ingredientName: "Onion", capacity: 1, quantity: 3, unit: Unit.PIECES },
    { ingredientName: "Garlic", capacity: 1, quantity: 1, unit: Unit.PIECES },
    { ingredientName: "Tomato", capacity: 1, quantity: 4, unit: Unit.PIECES },
  ],
  // BBQ Party
  1: [
    {
      ingredientName: "Chicken Breast",
      capacity: 2,
      quantity: 1,
      unit: Unit.KILOGRAM,
    },
    {
      ingredientName: "Ground Beef",
      capacity: 1.5,
      quantity: 1,
      unit: Unit.KILOGRAM,
    },
    {
      ingredientName: "Bell Pepper",
      capacity: 1,
      quantity: 6,
      unit: Unit.PIECES,
    },
    { ingredientName: "Onion", capacity: 1, quantity: 4, unit: Unit.PIECES },
  ],
  // Vegan Meals
  2: [
    { ingredientName: "Tomato", capacity: 1, quantity: 6, unit: Unit.PIECES },
    {
      ingredientName: "Bell Pepper",
      capacity: 1,
      quantity: 4,
      unit: Unit.PIECES,
    },
    { ingredientName: "Carrot", capacity: 1, quantity: 5, unit: Unit.PIECES },
    { ingredientName: "Olive Oil", capacity: 1, quantity: 1, unit: Unit.LITRE },
  ],
  // Baking Basics
  3: [
    { ingredientName: "Flour", capacity: 5, quantity: 1, unit: Unit.KILOGRAM },
    { ingredientName: "Sugar", capacity: 2, quantity: 1, unit: Unit.KILOGRAM },
    { ingredientName: "Butter", capacity: 1, quantity: 2, unit: Unit.PIECES },
    { ingredientName: "Eggs", capacity: 12, quantity: 2, unit: Unit.PIECES },
    { ingredientName: "Milk", capacity: 2, quantity: 1, unit: Unit.LITRE },
  ],
  // Holiday Dinner
  4: [
    {
      ingredientName: "Chicken Breast",
      capacity: 2,
      quantity: 2,
      unit: Unit.KILOGRAM,
    },
    { ingredientName: "Carrot", capacity: 1, quantity: 10, unit: Unit.PIECES },
    { ingredientName: "Onion", capacity: 1, quantity: 5, unit: Unit.PIECES },
    { ingredientName: "Garlic", capacity: 1, quantity: 2, unit: Unit.PIECES },
    { ingredientName: "Butter", capacity: 1, quantity: 3, unit: Unit.PIECES },
    { ingredientName: "Basil", capacity: 1, quantity: 2, unit: Unit.PIECES },
  ],
  // Weekly Shop
  5: [
    { ingredientName: "Milk", capacity: 2, quantity: 2, unit: Unit.LITRE },
    { ingredientName: "Eggs", capacity: 12, quantity: 1, unit: Unit.PIECES },
    { ingredientName: "Bread", capacity: 1, quantity: 2, unit: Unit.PIECES },
    {
      ingredientName: "Chicken Breast",
      capacity: 1,
      quantity: 1,
      unit: Unit.KILOGRAM,
    },
    { ingredientName: "Tomato", capacity: 0.5, quantity: 6, unit: Unit.PIECES },
    { ingredientName: "Carrot", capacity: 1, quantity: 4, unit: Unit.PIECES },
    { ingredientName: "Onion", capacity: 0.5, quantity: 4, unit: Unit.PIECES },
    { ingredientName: "Garlic", capacity: 0.5, quantity: 1, unit: Unit.PIECES },
  ],
};

// ==================== PANTRY INGREDIENT DATA ====================
// Ingredients the main user currently has at home.
// ingredientName is used to look up ingredientId after ingredients are inserted.

export interface PantryIngredientSeed {
  ingredientName: string;
  capacity?: number;
  quantity?: number;
  unit: (typeof Unit)[keyof typeof Unit];
}

export const seedPantryIngredients: PantryIngredientSeed[] = [
  { ingredientName: "Olive Oil", capacity: 0.5, quantity: 1, unit: Unit.LITRE },
  { ingredientName: "Garlic", capacity: 1, quantity: 2, unit: Unit.PIECES },
  { ingredientName: "Onion", capacity: 1, quantity: 3, unit: Unit.PIECES },
  { ingredientName: "Eggs", capacity: 12, quantity: 1, unit: Unit.PIECES },
  { ingredientName: "Butter", capacity: 1, quantity: 1, unit: Unit.PIECES },
  { ingredientName: "Flour", capacity: 2, quantity: 1, unit: Unit.KILOGRAM },
  { ingredientName: "Milk", capacity: 1, quantity: 1, unit: Unit.LITRE },
  { ingredientName: "Sugar", capacity: 1, quantity: 1, unit: Unit.KILOGRAM },
];