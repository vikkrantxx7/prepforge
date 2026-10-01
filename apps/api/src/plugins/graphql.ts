import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { FastifyPluginAsync } from "fastify";
import mercurius from "mercurius";
import {
	INVALID_USER_OR_QUESTION_ID_ERROR,
	UNAUTHORIZED_ERROR,
} from "../constants/errors.js";
import { createProgressLoader } from "../graphql/dataloaders.js";
import { resolvers } from "../graphql/resolvers.js";

const schema = readFileSync(
	join(import.meta.dirname, "..", "graphql", "schema.graphql"),
	"utf-8",
);

export const graphqlPlugin: FastifyPluginAsync = async (app) => {
	app.register(mercurius, {
		schema,
		resolvers: resolvers as never,
		graphiql: true,
		context: async (request) => {
			try {
				await request.jwtVerify();
			} catch (_err) {
				// guest — user stays undefined
			}

			return {
				user: request.user,
				progressLoader: request.user
					? createProgressLoader(request.user.userId)
					: null,
			};
		},
		errorFormatter: (execution) => {
			const normalizedErrors = execution.errors?.map((error) => {
				const isUnauthorized = error.message === UNAUTHORIZED_ERROR;
				const isInvalidRelation =
					typeof error.cause === "object" &&
					error.cause !== null &&
					"code" in error.cause &&
					error.cause.code === "23503";

				const formatted = error.toJSON();
				let message = formatted.message;
				if (isUnauthorized) {
					message = UNAUTHORIZED_ERROR;
				}
				if (isInvalidRelation) {
					message = INVALID_USER_OR_QUESTION_ID_ERROR;
				}

				return {
					formattedError: { ...formatted, message },
					isUnauthorized,
					isInvalidRelation,
				};
			});

			const hasUnauthorized = normalizedErrors?.some(
				(item) => item.isUnauthorized,
			);
			const hasInvalidRelation = normalizedErrors?.some(
				(item) => item.isInvalidRelation,
			);

			let statusCode = 200;
			if (hasInvalidRelation) {
				statusCode = 404;
			}
			if (hasUnauthorized) {
				statusCode = 401;
			}

			return {
				statusCode,
				response: {
					...execution,
					errors: normalizedErrors?.map((item) => item.formattedError),
				},
			};
		},
	});
};
