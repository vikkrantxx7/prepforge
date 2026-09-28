import {
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const topics = pgTable("topics", {
	id: text("id").primaryKey(),
	name: varchar("name", { length: 60 }).notNull(),
	slug: varchar("slug", { length: 60 }).notNull().unique(),
	category: varchar("category", { length: 60 }).notNull(),
	description: text("description"),
	createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }),
});

export const questions = pgTable("questions", {
	id: text("id").primaryKey(),
	text: text("text").notNull(),
	topicIds: text("topic_ids").array(),
	difficultyContext: jsonb("difficulty_context"),
	answerTiers: jsonb("answer_tiers"),
	interviewerIntent: text("interviewer_intent"),
	recency: varchar("recency", { length: 20 }),
	tags: text("tags").array(),
	hints: text("hints").array(),
	relatedQuestionIds: text("related_question_ids").array(),
	status: varchar("status", { length: 20 }).notNull().default("draft"),
	createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }),
});

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	role: varchar("role", { length: 50 }).notNull().default("user"),
	createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }),
});

export const userProgress = pgTable(
	"user_progress",
	{
		userId: text("user_id").notNull(),
		questionId: text("question_id").notNull(),
		status: varchar("status", { length: 20 }).notNull(),
		lastSeen: timestamp("last_seen", {
			mode: "string",
			withTimezone: true,
		}).notNull(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.questionId] })],
);
