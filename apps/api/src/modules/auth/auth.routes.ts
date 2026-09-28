import type { CreateUserInput } from "@prepforge/shared";
import { CreateUserSchema } from "@prepforge/shared";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsync } from "fastify";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

export const authRoutes: FastifyPluginAsync = async (app) => {
	app.get("/me", { preHandler: [app.authenticate] }, async (request, reply) => {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.id, request.user?.userId));

		if (!user) {
			return reply.status(404).send({ error: "User not found" });
		}

		return reply.send({ email: user.email, role: user.role });
	});

	app.post<{ Body: CreateUserInput }>("/login", async (request, reply) => {
		const parsed = CreateUserSchema.parse(request.body);

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, parsed.email));

		if (!user) {
			return reply.status(401).send({ error: "Invalid email or password" });
		}

		const isPasswordValid = await bcrypt.compare(
			parsed.password,
			user.passwordHash,
		);

		if (!isPasswordValid) {
			return reply.status(401).send({ error: "Invalid email or password" });
		}

		const token = app.jwt.sign({ role: user.role, userId: user.id });
		return reply.send({ token });
	});

	app.post<{ Body: CreateUserInput }>("/register", async (request, reply) => {
		const parsed = CreateUserSchema.parse(request.body);
		const id = crypto.randomUUID();
		const passwordHash = await bcrypt.hash(parsed.password, 10);

		try {
			const [newUser] = await db
				.insert(users)
				.values({ id, email: parsed.email, passwordHash })
				.returning();

			if (!newUser) {
				return reply.status(500).send({ error: "Failed to create user" });
			}

			reply.status(201).send({ email: newUser.email, role: newUser.role });
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
				return reply.status(409).send({ error: "Email already exists" });
			}

			throw error;
		}
	});
};
