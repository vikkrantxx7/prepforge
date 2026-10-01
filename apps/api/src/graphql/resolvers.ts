import { progressSchema } from "@prepforge/shared";
import type DataLoader from "dataloader";
import { arrayContains, eq } from "drizzle-orm";
import { UNAUTHORIZED_ERROR } from "../constants/errors.js";
import { db } from "../db/index.js";
import { questions, topics, userProgress } from "../db/schema.js";

export const resolvers = {
	Query: {
		topics: async (_: unknown, { category }: { category?: string }) => {
			if (category) {
				return db.select().from(topics).where(eq(topics.category, category));
			}

			return db.select().from(topics);
		},
		topic: async (_: unknown, { slug }: { slug: string }) => {
			const topic = await db
				.select()
				.from(topics)
				.where(eq(topics.slug, slug))
				.limit(1)
				.then((rows) => rows[0]);

			return topic ?? null;
		},
		questions: async (_: unknown, { topicId }: { topicId?: string }) => {
			if (topicId) {
				return db
					.select()
					.from(questions)
					.where(arrayContains(questions.topicIds, [topicId]));
			}
			return db.select().from(questions);
		},
		question: async (_: unknown, { questionId }: { questionId: string }) => {
			const question = await db
				.select()
				.from(questions)
				.where(eq(questions.id, questionId))
				.limit(1)
				.then((rows) => rows[0]);

			return question ?? null;
		},
		myProgress: async (
			_: unknown,
			__: unknown,
			context: { user?: { userId: string } },
		) => {
			if (!context.user) {
				return [];
			}

			return db
				.select()
				.from(userProgress)
				.where(eq(userProgress.userId, context.user.userId));
		},
	},
	Question: {
		progress: async (
			parent: { id: string },
			_: unknown,
			context: {
				progressLoader: DataLoader<
					string,
					(typeof userProgress)[] | null
				> | null;
			},
		) => {
			if (!context.progressLoader) {
				console.log("No progress loader available");
				return null;
			}
			console.log("Progress loader available", parent.id);

			return context.progressLoader.load(parent.id);
		},
	},
	Mutation: {
		updateProgress: async (
			_: unknown,
			{ questionId, status }: { questionId: string; status: string },
			context: { user?: { userId: string } },
		) => {
			if (!context.user) {
				throw new Error(UNAUTHORIZED_ERROR);
			}

			const parsed = progressSchema.parse({
				userId: context.user.userId,
				questionId,
				status,
			});
			const lastSeen = new Date().toISOString();

			const [progress] = await db
				.insert(userProgress)
				.values({ ...parsed, lastSeen })
				.onConflictDoUpdate({
					target: [userProgress.userId, userProgress.questionId],
					set: { status: parsed.status, lastSeen },
				})
				.returning();

			return progress ?? null;
		},
	},
};
