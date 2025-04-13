CREATE TYPE "public"."season" AS ENUM('spring', 'winter', 'summer', 'fall');--> statement-breakpoint
CREATE TYPE "public"."unit" AS ENUM('kg', 'lb', 'L', 'qt', 'cup', 'tbsp', 'tsp', 'item');--> statement-breakpoint
CREATE TABLE "grocery_list" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "grocery_list_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"ingredients" integer[] DEFAULT '{}',
	"userId" integer NOT NULL,
	"public" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ingredient" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ingredient_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"userId" integer,
	"price" integer DEFAULT 100,
	"capacity" numeric DEFAULT 1,
	"quantity" integer DEFAULT 1,
	"unit" "unit" NOT NULL,
	"image" varchar(255),
	"season" "season",
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
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
	"ingredients" integer[] DEFAULT '{}',
	"userId" integer NOT NULL,
	"public" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"image" varchar(255),
	"preferences" jsonb DEFAULT '{"units":{"mass":"kg","volume":"L"},"colorMode":"dark","displayName":""}'::jsonb,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "grocery_list" ADD CONSTRAINT "grocery_list_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingredient" ADD CONSTRAINT "ingredient_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;