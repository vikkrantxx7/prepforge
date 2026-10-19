CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(60) NOT NULL,
	"name" varchar(60) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_category_categories_slug_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("slug") ON DELETE no action ON UPDATE cascade;