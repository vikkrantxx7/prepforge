import { CreateTopicSchema } from "@prepforge/shared";
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
};
