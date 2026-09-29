import cors from "@fastify/cors";
import Fastify from "fastify";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { progressRoutes } from "./modules/progress/progress.routes.js";
import { questionsRoutes } from "./modules/questions/questions.routes.js";
import { topicsRoutes } from "./modules/topics/topics.routes.js";
import { jwtPlugin } from "./plugins/jwt.js";

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

	app.register(jwtPlugin);
	app.register(authRoutes, { prefix: "/api/v1/auth" });
	app.register(topicsRoutes, { prefix: "/api/v1/topics" });
	app.register(progressRoutes, { prefix: "/api/v1" });
	app.register(questionsRoutes, { prefix: "/api/v1/questions" });

	return app;
}
