import { z } from "zod";

export const CreateTopicSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
	description: z.string(),
	category: z.string().min(1, "Category is required"),
});
export type CreateTopicInput = z.infer<typeof CreateTopicSchema>;

export const UpdateTopicSchema = CreateTopicSchema.partial();
export type UpdateTopicInput = z.infer<typeof UpdateTopicSchema>;
