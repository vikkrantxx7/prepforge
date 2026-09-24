import {
	CreateTopicSchema,
	type UpdateTopicInput,
	UpdateTopicSchema,
} from "@prepforge/shared";
import type { FastifyPluginAsync } from "fastify";
import { topicsStore } from "./topics.store.js";

export const topicsRoutes: FastifyPluginAsync = async (app) => {
	app.get("/", async () => {
		return { topics: Array.from(topicsStore.values()) };
	});

	app.post("/", async (request, reply) => {
		const parsed = CreateTopicSchema.parse(request.body);
		const id = crypto.randomUUID();
		const topic = { id, ...parsed, createdAt: new Date().toISOString() };

		topicsStore.set(id, topic);
		return reply.status(201).send({ topic });
	});

	app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
		const { id } = request.params;
		const topic = topicsStore.get(id);

		if (!topic) {
			return reply.status(404).send({ error: "Topic not found" });
		}

		return { topic };
	});

	app.patch<{ Params: { id: string }; Body: UpdateTopicInput }>(
		"/:id",
		async (request, reply) => {
			const { id } = request.params;
			const existingTopic = topicsStore.get(id);

			if (!existingTopic) {
				return reply.status(404).send({ error: "Topic not found" });
			}

			const parsed = UpdateTopicSchema.parse(request.body);
			const updatedTopic = {
				...existingTopic,
				...parsed,
				updatedAt: new Date().toISOString(),
			};

			topicsStore.set(id, updatedTopic);
			return { topic: updatedTopic };
		},
	);

	app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
		const { id } = request.params;
		const existingTopic = topicsStore.get(id);

		if (!existingTopic) {
			return reply.status(404).send({ error: "Topic not found" });
		}

		topicsStore.delete(id);
		return reply.status(204).send();
	});
};
