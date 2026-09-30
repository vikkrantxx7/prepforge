import fastifyJwt from "@fastify/jwt";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { UNAUTHORIZED_ERROR } from "../constants/errors.js";

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
				reply.status(401).send({ error: UNAUTHORIZED_ERROR });
			}
		},
	);

	app.decorate(
		"optionalAuth",
		async (request: FastifyRequest, _reply: FastifyReply) => {
			try {
				await request.jwtVerify();
			} catch (_err) {
				// Do nothing, user is not authenticated
			}
		},
	);
});
