import { z } from "zod";

export const progressSchema = z.object({
	userId: z.string(),
	questionId: z.string(),
	status: z.enum(["studying", "completed"]),
});
