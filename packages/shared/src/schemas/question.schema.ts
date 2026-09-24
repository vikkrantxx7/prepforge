import { z } from "zod";

export const CreateQuestionSchema = z.object({
	text: z.string().min(1),
	topicIds: z.array(z.string()),
	interviewerIntent: z.string(),
	difficultyContext: z.array(
		z.object({
			role: z.enum(["junior", "mid", "senior"]),
			company: z.enum(["startup", "midsize", "faang"]),
			difficulty: z.enum(["easy", "medium", "hard"]),
		}),
	),
	answerTiers: z.object({
		passing: z.string(),
		good: z.string(),
		standout: z.string(),
	}),
	status: z.enum(["draft", "published", "pending_review"]).default("draft"),
	tags: z.array(z.string()),
	recency: z.enum(["recent", "classic", "deprecated"]),
	relatedQuestionIds: z.array(z.string()),
	hints: z.array(z.string()),
});
export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;

export const UpdateQuestionSchema = CreateQuestionSchema.partial();
export type UpdateQuestionInput = z.infer<typeof UpdateQuestionSchema>;
