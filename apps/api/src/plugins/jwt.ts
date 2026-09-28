import fastifyJwt from "@fastify/jwt";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
	interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: {
			userId: string;
			role: string;
		};
	}
}

export const jwtPlugin = fp(async (app: FastifyInstance) => {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw new Error("JWT_SECRET is not defined");
	}

	app.register(fastifyJwt, { secret });

	app.decorate(
		"authenticate",
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				await request.jwtVerify();
			} catch (_err) {
				reply.status(401).send({ error: "Unauthorized" });
			}
		},
	);
});
