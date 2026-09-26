import type { FastifyPluginAsync } from "fastify";

export const authRoutes: FastifyPluginAsync = async (app) => {
	app.post<{ Body: { secret: string } }>("/token", async (request, reply) => {
		if (request.body.secret !== process.env.ADMIN_SECRET) {
			return reply.status(401).send({ error: "Invalid secret" });
		}

		const token = app.jwt.sign({ role: "admin" });
		return reply.send({ token });
	});
};
