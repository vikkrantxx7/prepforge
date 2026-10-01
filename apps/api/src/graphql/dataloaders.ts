import DataLoader from "dataloader";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import { userProgress } from "../db/schema.js";

export const createProgressLoader = (userId: string) => {
	return new DataLoader(async (questionIds: readonly string[]) => {
		console.log("Loading progress for question IDs:", questionIds);
		const progress = await db
			.select()
			.from(userProgress)
			.where(
				and(
					eq(userProgress.userId, userId),
					inArray(userProgress.questionId, questionIds),
				),
			);
		console.log("Fetched progress from DB:", progress);
		const progressMap = progress.reduce(
			(acc, item): Record<string, (typeof progress)[number] | null> => {
				if (!acc[item.questionId]) {
					acc[item.questionId] = item;
				} else {
					acc[item.questionId] = null;
				}

				return acc;
			},
			{},
		);
		console.log("Progress map before mapping:", progressMap);
		console.log(
			"Progress map:",
			questionIds.map((questionId) => progressMap[questionId] ?? null),
		);

		return questionIds.map((questionId) => progressMap[questionId] ?? null);
	});
};
