import { progressSchema } from '@prepforge/shared';
import { eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { INVALID_USER_OR_QUESTION_ID_ERROR } from '../../constants/errors.js';
import { db } from '../../db/index.js';
import { userProgress } from '../../db/schema.js';

export const progressRoutes: FastifyPluginAsync = async (app) => {
  app.get('/users/me/progress', { preHandler: [app.optionalAuth] }, async (request, reply) => {
    if (request.user) {
      const user = request.user;
      const progress = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, user.userId));

      return reply.send({ progress });
    }

    reply.send({ progress: [] });
  });

  app.patch<{ Params: { id: string }; Body: { status: string } }>(
    '/questions/:id/progress',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { userId } = request.user;
      const { id } = request.params;
      const { status } = request.body;
      const parsed = progressSchema.parse({
        userId,
        questionId: id,
        status,
      });
      const lastSeen = new Date().toISOString();

      try {
        const [insert] = await db
          .insert(userProgress)
          .values({ ...parsed, lastSeen })
          .onConflictDoUpdate({
            target: [userProgress.userId, userProgress.questionId],
            set: { status: parsed.status, lastSeen },
          })
          .returning();

        return reply.send({ progress: insert });
      } catch (error) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'cause' in error &&
          typeof error.cause === 'object' &&
          error.cause !== null &&
          'code' in error.cause &&
          error.cause.code === '23503'
        ) {
          return reply.status(404).send({ error: INVALID_USER_OR_QUESTION_ID_ERROR });
        }

        throw error;
      }
    },
  );
};
