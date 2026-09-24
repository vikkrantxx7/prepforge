import cors from "@fastify/cors";
import Fastify from "fastify";
import { questionsRoutes } from "./modules/questions/questions.routes.js";
import { topicsRoutes } from "./modules/topics/topics.routes.js";

export function buildApp() {
	const app = Fastify({
		logger: true,
	});

	app.register(cors, {
		origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
	});

	app.get("/health", async () => {
		return { status: "ok" };
	});

	app.register(topicsRoutes, { prefix: "/api/v1/topics" });
	app.register(questionsRoutes, { prefix: "/api/v1/questions" });

	return app;
}
