CREATE TABLE "user_progress" (
	"user_id" text NOT NULL,
	"question_id" text NOT NULL,
	"status" varchar(20) NOT NULL,
	"last_seen" timestamp with time zone NOT NULL,
	CONSTRAINT "user_progress_user_id_question_id_pk" PRIMARY KEY("user_id","question_id")
);
