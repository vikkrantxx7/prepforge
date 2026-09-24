type DifficultyContext = {
	role: "junior" | "mid" | "senior";
	company: "startup" | "midsize" | "faang";
	difficulty: "easy" | "medium" | "hard";
};

type AnswerTiers = {
	passing: string;
	good: string;
	standout: string;
};

export type Question = {
	id: string;
	text: string;
	topicIds: string[];
	interviewerIntent: string;
	difficultyContext: DifficultyContext[];
	answerTiers: AnswerTiers;
	tags: string[];
	recency: "recent" | "classic" | "deprecated";
	relatedQuestionIds: string[];
	hints: string[];
	status: "draft" | "published" | "pending_review";
	createdAt: string;
	updatedAt?: string;
	// TODO: add createdBy (userId) in Week 2
};
