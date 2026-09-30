import {
	type CreateTopicInput,
	CreateTopicSchema,
	type UpdateTopicInput,
	UpdateTopicSchema,
} from "@prepforge/shared";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsync } from "fastify";
import { db } from "../../db/index.js";
import { topics } from "../../db/schema.js";

function mapTopic(row: typeof topics.$inferSelect) {
	return {
		...row,
		createdAt: new Date(row.createdAt).toISOString(),
		updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
	};
}

export const topicsRoutes: FastifyPluginAsync = async (app) => {
	app.get("/", async () => {
		const dbTopics = await db.select().from(topics);
		return { topics: dbTopics.map(mapTopic) };
	});

	app.post<{ Body: CreateTopicInput }>(
		"/",
		{ preHandler: [app.authenticate] },
		async (request, reply) => {
			const parsed = CreateTopicSchema.parse(request.body);
			const id = crypto.randomUUID();
			const topic = { id, ...parsed };

			try {
				const [inserted] = await db.insert(topics).values(topic).returning();

				if (!inserted) {
					return reply.status(500).send({ error: "Failed to create topic" });
				}

				return reply.status(201).send({ topic: mapTopic(inserted) });
			} catch (error) {
				if (
					typeof error === "object" &&
					error !== null &&
					"cause" in error &&
					typeof error.cause === "object" &&
					error.cause !== null &&
					"code" in error.cause &&
					error.cause.code === "23505"
				) {
					return reply.status(409).send({ error: "Slug already exists" });
				}

				throw error;
			}
		},
	);

	app.get<{ Params: { slug: string } }>("/:slug", async (request, reply) => {
		const { slug } = request.params;
		const [topic] = await db.select().from(topics).where(eq(topics.slug, slug));

		if (!topic) {
			return reply.status(404).send({ error: "Topic not found" });
		}

		return { topic: mapTopic(topic) };
	});

	app.patch<{ Params: { slug: string }; Body: UpdateTopicInput }>(
		"/:slug",
		{ preHandler: [app.authenticate] },
		async (request, reply) => {
			const { slug } = request.params;
			const [existingTopic] = await db
				.select()
				.from(topics)
				.where(eq(topics.slug, slug));

			if (!existingTopic) {
				return reply.status(404).send({ error: "Topic not found" });
			}

			const parsed = UpdateTopicSchema.parse(request.body);

			try {
				const [updatedTopic] = await db
					.update(topics)
					.set({ ...parsed, updatedAt: new Date().toISOString() })
					.where(eq(topics.slug, slug))
					.returning();

				if (!updatedTopic) {
					return reply.status(500).send({ error: "Failed to update topic" });
				}

				return { topic: mapTopic(updatedTopic) };
			} catch (error) {
				if (
					typeof error === "object" &&
					error !== null &&
					"cause" in error &&
					typeof error.cause === "object" &&
					error.cause !== null &&
					"code" in error.cause &&
					error.cause.code === "23505"
				) {
					return reply.status(409).send({ error: "Slug already exists" });
				}

				throw error;
			}
		},
	);

	app.delete<{ Params: { slug: string } }>("/:slug", async (request, reply) => {
		const { slug } = request.params;
		const [existingTopic] = await db
			.select()
			.from(topics)
			.where(eq(topics.slug, slug));

		if (!existingTopic) {
			return reply.status(404).send({ error: "Topic not found" });
		}

		await db.delete(topics).where(eq(topics.slug, slug));

		return reply.status(204).send();
	});
};
