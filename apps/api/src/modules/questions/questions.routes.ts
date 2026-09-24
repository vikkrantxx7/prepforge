import {
	type CreateQuestionInput,
	CreateQuestionSchema,
	type UpdateQuestionInput,
	UpdateQuestionSchema,
} from "@prepforge/shared";
import type { FastifyPluginAsync } from "fastify";
import { questionsStore } from "./questions.store.js";

export const questionsRoutes: FastifyPluginAsync = async (app) => {
	app.get("/", async () => {
		return { questions: Array.from(questionsStore.values()) };
	});

	app.post<{ Body: CreateQuestionInput }>("/", async (request, reply) => {
		const parsed = CreateQuestionSchema.parse(request.body);
		const id = crypto.randomUUID();
		const newQuestion = {
			id,
			...parsed,
			createdAt: new Date().toISOString(),
		};

		questionsStore.set(id, newQuestion);

		return reply.status(201).send({ question: newQuestion });
	});

	app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
		const { id } = request.params;
		const question = questionsStore.get(id);

		if (!question) {
			return reply.status(404).send({ error: "Question not found" });
		}
		return { question };
	});

	app.patch<{ Params: { id: string }; Body: UpdateQuestionInput }>(
		"/:id",
		async (request, reply) => {
			const { id } = request.params;
			const existingQuestion = questionsStore.get(id);

			if (!existingQuestion) {
				return reply.status(404).send({ error: "Question not found" });
			}

			const parsed = UpdateQuestionSchema.parse(request.body);
			const updatedQuestion = {
				...existingQuestion,
				...parsed,
				updatedAt: new Date().toISOString(),
			};

			questionsStore.set(id, updatedQuestion);

			return { question: updatedQuestion };
		},
	);

	app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
		const { id } = request.params;
		const existingQuestion = questionsStore.get(id);

		if (!existingQuestion) {
			return reply.status(404).send({ error: "Question not found" });
		}

		questionsStore.delete(id);

		return reply.status(204).send();
	});

	app.post<{ Params: { id: string } }>(
		"/:id/publish",
		async (request, reply) => {
			const { id } = request.params;
			const existingQuestion = questionsStore.get(id);

			if (!existingQuestion) {
				return reply.status(404).send({ error: "Question not found" });
			}

			const publishedQuestion = {
				...existingQuestion,
				status: "published" as const,
				updatedAt: new Date().toISOString(),
			};

			questionsStore.set(id, publishedQuestion);

			return { question: publishedQuestion };
		},
	);

	app.post<{ Params: { id: string } }>(
		"/:id/unpublish",
		async (request, reply) => {
			const { id } = request.params;
			const existingQuestion = questionsStore.get(id);

			if (!existingQuestion) {
				return reply.status(404).send({ error: "Question not found" });
			}

			const unpublishedQuestion = {
				...existingQuestion,
				status: "draft" as const,
				updatedAt: new Date().toISOString(),
			};

			questionsStore.set(id, unpublishedQuestion);

			return { question: unpublishedQuestion };
		},
	);
};
