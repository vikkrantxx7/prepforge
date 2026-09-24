import type { Question } from "@prepforge/shared";
import { topicsStore } from "../topics/topics.store.js";

export const questionsStore = new Map<string, Question>();

const topicId = topicsStore.keys().next().value ?? "";
const id = crypto.randomUUID();

questionsStore.set(id, {
	id,
	text: "Sample question",
	topicIds: [topicId],
	interviewerIntent: "Assess problem-solving skills",
	difficultyContext: [
		{
			role: "junior",
			company: "startup",
			difficulty: "easy",
		},
	],
	answerTiers: {
		passing: "Basic understanding",
		good: "Good understanding",
		standout: "Exceptional understanding",
	},
	tags: ["sample", "question"],
	recency: "recent",
	relatedQuestionIds: [],
	hints: ["Think about the basics"],
	status: "draft",
	createdAt: new Date().toISOString(),
});
