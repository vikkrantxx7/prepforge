import type { FastifyPluginAsync } from "fastify";

export const topicsRoutes: FastifyPluginAsync = async (app) => {
	app.get("/", async () => {
		return { topics: [] };
	});
};
