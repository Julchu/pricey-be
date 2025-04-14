import { jsonb, pgTable, varchar } from "drizzle-orm/pg-core";
import { requiredColumns, timestamps } from "../utils/shared-schema.ts";
import { Color, Unit, type UserPreferences } from "../../utils/interfaces.ts";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const userTable = pgTable("user", {
  ...requiredColumns,
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  image: varchar({ length: 255 }),
  preferences: jsonb()
    .$type<UserPreferences>()
    .default({
      units: {
        mass: Unit.KILOGRAM,
        volume: Unit.LITRE,
      },
      colorMode: Color.DARK,
      displayName: "",
    }),
  ...timestamps,
});

export type SelectUser = InferSelectModel<typeof userTable>;
export type InsertUser = InferInsertModel<typeof userTable>;

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
];