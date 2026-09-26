import {
	type CreateQuestionInput,
	CreateQuestionSchema,
	type UpdateQuestionInput,
	UpdateQuestionSchema,
} from "@prepforge/shared";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsync } from "fastify";
import { db } from "../../db/index.js";
import { questions } from "../../db/schema.js";

function mapQuestion(row: typeof questions.$inferSelect) {
	return {
		...row,
		createdAt: new Date(row.createdAt).toISOString(),
		updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
	};
}

export const questionsRoutes: FastifyPluginAsync = async (app) => {
	app.get("/", async () => {
		const dbQuestions = await db.select().from(questions);

		return { questions: dbQuestions.map(mapQuestion) };
	});

	app.post<{ Body: CreateQuestionInput }>(
		"/",
		{ preHandler: [app.authenticate] },
		async (request, reply) => {
			const parsed = CreateQuestionSchema.parse(request.body);
			const id = crypto.randomUUID();
			const sanitizedTags = [...new Set(parsed.tags.map((s) => s.trim().toLowerCase()).filter(Boolean))];

			const newQuestion = {
				id,
				...parsed,
				tags: sanitizedTags,
				status: "draft" as const,
			};

			const [inserted] = await db
				.insert(questions)
				.values(newQuestion)
				.returning();

			if (!inserted) {
				return reply.status(500).send({ error: "Failed to create question" });
			}

			return reply.status(201).send({ question: mapQuestion(inserted) });
		},
	);

	app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
		const { id } = request.params;
		const [question] = await db
			.select()
			.from(questions)
			.where(eq(questions.id, id));

		if (!question) {
			return reply.status(404).send({ error: "Question not found" });
		}
		return { question: mapQuestion(question) };
	});

	app.patch<{ Params: { id: string }; Body: UpdateQuestionInput }>(
		"/:id",
		{ preHandler: [app.authenticate] },
		async (request, reply) => {
			const { id } = request.params;

			const parsed = UpdateQuestionSchema.parse(request.body);
			const sanitizedTags = parsed.tags ? [...new Set(parsed.tags.map((s) => s.trim().toLowerCase()).filter(Boolean))] : undefined;

			const [existing] = await db
				.select()
				.from(questions)
				.where(eq(questions.id, id));

			if (!existing)
				return reply.status(404).send({ error: "Question not found" });

			const [updated] = await db
				.update(questions)
				.set({ ...parsed, ...(sanitizedTags !== undefined && { tags: sanitizedTags }), updatedAt: new Date().toISOString() })
				.where(eq(questions.id, id))
				.returning();

			if (!updated) {
				return reply.status(500).send({ error: "Failed to update question" });
			}

			return { question: mapQuestion(updated) };
		},
	);

	app.delete<{ Params: { id: string } }>(
		"/:id",
		{ preHandler: [app.authenticate] },
		async (request, reply) => {
			const { id } = request.params;
			const [existingQuestion] = await db
				.select()
				.from(questions)
				.where(eq(questions.id, id));

			if (!existingQuestion) {
				return reply.status(404).send({ error: "Question not found" });
			}

			await db.delete(questions).where(eq(questions.id, id));

			return reply.status(204).send();
		},
	);

	app.post<{ Params: { id: string } }>(
		"/:id/publish",
		{ preHandler: [app.authenticate] },
		async (request, reply) => {
			const { id } = request.params;
			const [existingQuestion] = await db
				.select()
				.from(questions)
				.where(eq(questions.id, id));

			if (!existingQuestion) {
				return reply.status(404).send({ error: "Question not found" });
			}

			const [published] = await db
				.update(questions)
				.set({
					status: "published",
					updatedAt: new Date().toISOString(),
				})
				.where(eq(questions.id, id))
				.returning();

			if (!published) {
				return reply.status(500).send({ error: "Failed to publish question" });
			}

			return { question: mapQuestion(published) };
		},
	);

	app.post<{ Params: { id: string } }>(
		"/:id/unpublish",
		{ preHandler: [app.authenticate] },
		async (request, reply) => {
			const { id } = request.params;
			const [existingQuestion] = await db
				.select()
				.from(questions)
				.where(eq(questions.id, id));

			if (!existingQuestion) {
				return reply.status(404).send({ error: "Question not found" });
			}

			const [unpublished] = await db
				.update(questions)
				.set({ status: "draft", updatedAt: new Date().toISOString() })
				.where(eq(questions.id, id))
				.returning();

			if (!unpublished) {
				return reply
					.status(500)
					.send({ error: "Failed to unpublish question" });
			}

			return { question: mapQuestion(unpublished) };
		},
	);
};
