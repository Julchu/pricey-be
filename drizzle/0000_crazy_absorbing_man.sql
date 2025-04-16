CREATE TYPE "public"."season" AS ENUM('spring', 'winter', 'summer', 'fall');--> statement-breakpoint
CREATE TYPE "public"."unit" AS ENUM('kg', 'lb', 'L', 'qt', 'cup', 'tbsp', 'tsp', 'item');--> statement-breakpoint
CREATE TABLE "grocery_list" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grocery_list_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
    "ingredients" integer[] DEFAULT '{}' NOT NULL,
	"userId" integer NOT NULL,
    "public"      boolean DEFAULT false NOT NULL,
    "updated_at"  timestamp             NOT NULL,
	"created_at" timestamp DEFAULT now(),
    "deleted_at"  timestamp,
    CONSTRAINT "unique_userId_groceryListName" UNIQUE ("userId", "name")
);
--> statement-breakpoint
CREATE TABLE "ingredient" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ingredient_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
    "userId"     integer             NOT NULL,
    "price"      integer DEFAULT 100 NOT NULL,
    "capacity"   numeric DEFAULT 1   NOT NULL,
	"quantity" integer DEFAULT 1,
	"unit" "unit" NOT NULL,
	"image" varchar(255),
	"season" "season",
    "updated_at" timestamp           NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
    CONSTRAINT "unique_userId_ingredientName" UNIQUE ("userId", "name"),
	CONSTRAINT "price_gt_0" CHECK ("ingredient"."price"
      > 0),
	CONSTRAINT "capacity_gt_0" CHECK ("ingredient"."capacity"
      > 0),
	CONSTRAINT "quantity_gt_0" CHECK ("ingredient"."quantity"
      > 0)
);
--> statement-breakpoint
CREATE TABLE "recipe" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "recipe_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
    "ingredients" integer[] DEFAULT '{}' NOT NULL,
	"userId" integer NOT NULL,
    "public"      boolean DEFAULT false NOT NULL,
    "updated_at"  timestamp             NOT NULL,
	"created_at" timestamp DEFAULT now(),
    "deleted_at"  timestamp,
    CONSTRAINT "unique_userId_recipeName" UNIQUE ("userId", "name")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"image" varchar(255),
    "preferences" jsonb DEFAULT '{
      "units": {
        "mass": "kg",
        "volume": "L"
      },
      "colorMode": "dark",
      "displayName": ""
    }'::jsonb NOT NULL,
    "updated_at"  timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
    CONSTRAINT "user_email_unique" UNIQUE ("email"),
    CONSTRAINT "unique_userEmail" UNIQUE ("email")
);
--> statement-breakpoint
ALTER TABLE "grocery_list" ADD CONSTRAINT "grocery_list_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;