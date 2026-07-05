CREATE TYPE "public"."season" AS ENUM('spring', 'winter', 'summer', 'fall');--> statement-breakpoint
CREATE TYPE "public"."unit" AS ENUM('kg', 'g', 'lb', 'oz', 'L', 'ml', 'qt', 'cup', 'tbsp', 'tsp', 'pcs');--> statement-breakpoint
CREATE TABLE "grocery_list_ingredients" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grocery_list_ingredients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"grocery_list_id" integer NOT NULL,
	"ingredient_id" integer,
	"name" varchar(255) NOT NULL,
	"capacity" numeric,
	"quantity" integer,
	"unit" "unit",
	"image" varchar(255),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "unique_groceryListIngredients" UNIQUE("public_id"),
	CONSTRAINT "unique_groceryListId_ingredientId" UNIQUE("grocery_list_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "grocery_lists" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grocery_lists_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" integer NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "unique_groceryLists" UNIQUE("public_id"),
	CONSTRAINT "unique_userId_groceryListName" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ingredients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" integer NOT NULL,
	"price" integer,
	"capacity" numeric,
	"quantity" integer,
	"unit" "unit",
	"image" varchar(255),
	"season" "season",
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "unique_ingredients" UNIQUE("id"),
	CONSTRAINT "unique_userId_ingredientName" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE "pantry_ingredients" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pantry_ingredients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	"capacity" numeric,
	"quantity" integer,
	"unit" "unit",
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "unique_pantryIngredients" UNIQUE("public_id"),
	CONSTRAINT "unique_userId_ingredientId" UNIQUE("user_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recipe_ingredients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" integer NOT NULL,
	"ingredient_id" integer,
	"name" varchar(255) NOT NULL,
	"capacity" numeric,
	"quantity" integer,
	"unit" "unit",
	"image" varchar(255),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "unique_recipeIngredients" UNIQUE("public_id"),
	CONSTRAINT "unique_recipeId_ingredientId" UNIQUE("recipe_id","ingredient_id")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recipes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"user_id" integer NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"image" varchar(255),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "unique_recipes" UNIQUE("public_id"),
	CONSTRAINT "unique_userId_recipeName" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"image" varchar(255),
	"preferences" jsonb DEFAULT '{"units":{"mass":"kg","volume":"L"},"colorMode":"dark","displayName":""}'::jsonb NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "unique_user" UNIQUE("public_id"),
	CONSTRAINT "unique_userEmail" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "grocery_list_ingredients" ADD CONSTRAINT "grocery_list_ingredients_grocery_list_id_grocery_lists_id_fk" FOREIGN KEY ("grocery_list_id") REFERENCES "public"."grocery_lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grocery_list_ingredients" ADD CONSTRAINT "grocery_list_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grocery_lists" ADD CONSTRAINT "grocery_lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pantry_ingredients" ADD CONSTRAINT "pantry_ingredients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pantry_ingredients" ADD CONSTRAINT "pantry_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;