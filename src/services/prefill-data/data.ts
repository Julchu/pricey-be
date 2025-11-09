import type { InsertUser } from "../../db/schemas/user-schema.ts";
import { Color, Season, Unit } from "../../utils/interfaces.ts";
import type { InsertRecipe } from "../../db/schemas/recipe-schema.ts";
import type { InsertIngredient } from "../../db/schemas/ingredient-schema.ts";
import type { InsertGroceryList } from "../../db/schemas/grocery-list-schema.ts";
import type { InsertRecipeIngredient } from "../../db/schemas/recipe-ingredient-schema.ts";
import type { InsertGroceryListIngredient } from "../../db/schemas/grocery-list-ingredient-schema.ts";

export const tempUsers: InsertUser[] = [
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
    publicId: "8d1dd2e1-a2ce-4793-b3bd-99a06d2b135a",
    email: process.env.MASTER_TEST_EMAIL || "",
    image: "https://avatars.githubusercontent.com/u/17052350?v=4",
    preferences: {
      units: { mass: Unit.POUND, volume: Unit.QUART },
      colorMode: Color.DARK,
      displayName: "julchu",
    },
  },
];

export const tempIngredients: InsertIngredient[] = [
  {
    name: "Olive Oil",
    price: 1000,
    unit: Unit.LITRE,
    image: "https://example.com/olive_oil.jpg",
    capacity: 1,
    quantity: 2,
    userId: 22,
  },
  {
    name: "Basil",
    price: 150,
    unit: Unit.ITEM,
    image: "https://example.com/basil.jpg",
    capacity: 3,
    quantity: 1,
    userId: 22,
    season: Season.SPRING,
  },
  {
    name: "Chicken Breast",
    price: 700,
    unit: Unit.KILOGRAM,
    image: "https://example.com/chicken.jpg",
    capacity: 2,
    quantity: 1,
    userId: 22,
  },
  {
    name: "Garlic",
    price: 300,
    unit: Unit.KILOGRAM,
    image: "https://example.com/garlic.jpg",
    capacity: 2,
    quantity: 1,
    userId: 22,
  },
  {
    name: "Tomato",
    price: 250,
    unit: Unit.KILOGRAM,
    image: "https://example.com/tomato.jpg",
    capacity: 5,
    quantity: 2,
    userId: 22,
    season: Season.SUMMER,
  },
];

export const tempGroceryLists: InsertGroceryList[] = [
  {
    name: "Soup",
    userId: 22,
    public: true,
  },
  {
    name: "BBQ Party",
    userId: 22,
    public: false,
  },
  {
    name: "Vegan Meals",
    userId: 22,
    public: true,
  },
  {
    name: "Baking Basics",
    userId: 22,
    public: false,
  },
  {
    name: "Holiday Dinner",
    userId: 22,
    public: true,
  },
];

export const tempGroceryListIngredients: InsertGroceryListIngredient[] = [
  {
    name: "Watercress",
    groceryListId: 1,
    capacity: 1,
    unit: Unit.ITEM,
    quantity: 2,
  },
  {
    name: "Pork Spare Rib",
    groceryListId: 1,
    capacity: 2,
    unit: Unit.POUND,
  },
  {
    name: "Gouda",
    groceryListId: 3,
    capacity: 1,
    unit: Unit.ITEM,
    quantity: 2,
  },
  {
    name: "Ground Beef",
    groceryListId: 3,
    capacity: 1.3,
    unit: Unit.POUND,
  },
  {
    name: "Eggs",
    groceryListId: 5,
    capacity: 1,
    unit: Unit.ITEM,
    quantity: 30,
  },
];

export const tempRecipes: InsertRecipe[] = [
  {
    name: "Spaghetti Bolognese",
    userId: 22,
    public: true,
  },
  {
    name: "Chicken Curry",
    userId: 22,
    public: true,
  },
  {
    name: "Vegetable Stir Fry",
    userId: 22,
    public: false,
  },
  {
    name: "Beef Tacos",
    userId: 22,
    public: true,
  },
  {
    name: "Quinoa Salad",
    userId: 22,
    public: false,
  },
];

export const tempRecipeIngredients: InsertRecipeIngredient[] = [
  {
    name: "Gouda",
    recipeId: 5,
    capacity: 3,
    quantity: 2,
    unit: Unit.TEASPOON,
  },
  {
    name: "Ground Beef",
    recipeId: 5,
    capacity: 1.3,
    unit: Unit.POUND,
  },
  {
    name: "Tomato",
    recipeId: 3,
    quantity: 5,
    unit: Unit.ITEM,
  },
  {
    name: "Salad",
    recipeId: 3,
    quantity: 1,
    unit: Unit.ITEM,
  },
  {
    name: "Chicken Thighs",
    recipeId: 1,
    capacity: 0.35,
    quantity: 3,
    unit: Unit.KILOGRAM,
  },
];