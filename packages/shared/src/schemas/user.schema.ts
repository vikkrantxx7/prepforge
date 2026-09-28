import { z } from "zod";

export const CreateUserSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,30}$/),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
