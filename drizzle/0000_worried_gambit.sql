CREATE TYPE "public"."season" AS ENUM('spring', 'winter', 'summer', 'fall');--> statement-breakpoint
CREATE TYPE "public"."unit" AS ENUM('kg', 'lb', 'L', 'qt', 'cup', 'tbsp', 'tsp', 'item');--> statement-breakpoint
CREATE TABLE "grocery_list_ingredients"
(
    "id"              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grocery_list_ingredients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
    "public_id"       uuid      DEFAULT gen_random_uuid() NOT NULL,
    "name"            varchar(255)                        NOT NULL,
    "grocery_list_id" integer                             NOT NULL,
    "capacity"        numeric   DEFAULT 1,
    "quantity"        integer   DEFAULT 1,
    "unit"            "unit",
    "image"           varchar(255),
    "updated_at"      timestamp DEFAULT now(),
    "created_at"      timestamp DEFAULT now(),
    "deleted_at"      timestamp,
    CONSTRAINT "unique_groceryListIngredients" UNIQUE ("public_id"),
    CONSTRAINT "unique_groceryListId_ingredientName" UNIQUE ("grocery_list_id", "name")
);
--> statement-breakpoint
CREATE TABLE "grocery_lists"
(
    "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grocery_lists_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
    "public_id"  uuid      DEFAULT gen_random_uuid() NOT NULL,
    "name"       varchar(255)                        NOT NULL,
    "user_id"    integer                             NOT NULL,
    "public"     boolean   DEFAULT false             NOT NULL,
    "updated_at" timestamp DEFAULT now(),
    "created_at" timestamp DEFAULT now(),
    "deleted_at" timestamp,
    CONSTRAINT "unique_groceryLists" UNIQUE ("public_id"),
    CONSTRAINT "unique_userId_groceryListName" UNIQUE ("user_id", "name")
);
--> statement-breakpoint
CREATE TABLE "ingredients"
(
    "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ingredients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
    "public_id"  uuid      DEFAULT gen_random_uuid() NOT NULL,
    "name"       varchar(255)                        NOT NULL,
    "user_id"    integer                             NOT NULL,
    "price"      integer   DEFAULT 100               NOT NULL,
    "capacity"   numeric   DEFAULT 1                 NOT NULL,
    "quantity"   integer   DEFAULT 1,
    "unit"       "unit"                              NOT NULL,
    "image"      varchar(255),
    "season"     "season",
    "updated_at" timestamp DEFAULT now(),
    "created_at" timestamp DEFAULT now(),
    "deleted_at" timestamp,
    CONSTRAINT "unique_ingredients" UNIQUE ("public_id"),
    CONSTRAINT "unique_userId_ingredientName" UNIQUE ("user_id", "name")
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients"
(
    "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recipe_ingredients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
    "public_id"  uuid      DEFAULT gen_random_uuid() NOT NULL,
    "name"       varchar(255)                        NOT NULL,
    "recipe_id"  integer                             NOT NULL,
    "capacity"   numeric   DEFAULT 1,
    "quantity"   integer   DEFAULT 1,
    "unit"       "unit",
    "image"      varchar(255),
    "updated_at" timestamp DEFAULT now(),
    "created_at" timestamp DEFAULT now(),
    "deleted_at" timestamp,
    CONSTRAINT "unique_recipeIngredients" UNIQUE ("public_id"),
    CONSTRAINT "unique_recipeId_ingredientName" UNIQUE ("recipe_id", "name")
);
--> statement-breakpoint
CREATE TABLE "recipes"
(
    "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recipes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
    "public_id"  uuid      DEFAULT gen_random_uuid() NOT NULL,
    "name"       varchar(255)                        NOT NULL,
    "user_id"    integer                             NOT NULL,
    "public"     boolean   DEFAULT false             NOT NULL,
    "updated_at" timestamp DEFAULT now(),
    "created_at" timestamp DEFAULT now(),
    "deleted_at" timestamp,
    CONSTRAINT "unique_recipes" UNIQUE ("public_id"),
    CONSTRAINT "unique_userId_recipeName" UNIQUE ("user_id", "name")
);
--> statement-breakpoint
CREATE TABLE "users"
(
    "id"          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
    "public_id"   uuid      DEFAULT gen_random_uuid() NOT NULL,
    "name"        varchar(255)                        NOT NULL,
    "email"       varchar(255)                        NOT NULL,
    "image"       varchar(255),
    "preferences" jsonb     DEFAULT '{
      "units": {
        "mass": "kg",
        "volume": "L"
      },
      "colorMode": "dark",
      "displayName": ""
    }'::jsonb NOT NULL,
    "updated_at"  timestamp DEFAULT now(),
    "created_at"  timestamp DEFAULT now(),
    "deleted_at"  timestamp,
    CONSTRAINT "users_email_unique" UNIQUE ("email"),
    CONSTRAINT "unique_user" UNIQUE ("public_id"),
    CONSTRAINT "unique_userEmail" UNIQUE ("email")
);
--> statement-breakpoint
ALTER TABLE "grocery_list_ingredients"
    ADD CONSTRAINT "grocery_list_ingredients_grocery_list_id_grocery_lists_id_fk" FOREIGN KEY ("grocery_list_id") REFERENCES "public"."grocery_lists" ("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grocery_lists"
    ADD CONSTRAINT "grocery_lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredients"
    ADD CONSTRAINT "ingredients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients"
    ADD CONSTRAINT "recipe_ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes" ("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes"
    ADD CONSTRAINT "recipes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE cascade ON UPDATE no action;