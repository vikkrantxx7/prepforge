CREATE TABLE "questions" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"topic_ids" text[],
	"difficulty_context" jsonb,
	"answer_tiers" jsonb,
	"interviewer_intent" text,
	"recency" varchar(20),
	"tags" text[],
	"hints" text[],
	"related_question_ids" text[],
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(60) NOT NULL,
	"slug" varchar(60) NOT NULL,
	"category" varchar(60) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
