import type { FastifyPluginAsync } from 'fastify';
import { createProgressRepository } from './progress.repository.js';
import { createProgressService } from './progress.service.js';

export const progressRoutes: FastifyPluginAsync = async (app) => {
  const repo = createProgressRepository();
  const service = createProgressService(repo);

  app.get('/users/me/progress', { preHandler: [app.optionalAuth] }, async (request) => {
    return { progress: await service.getProgress(request.user?.userId) };
  });

  app.patch<{ Params: { id: string }; Body: { status: string } }>(
    '/questions/:id/progress',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const progress = await service.updateProgress(
        request.user.userId,
        request.params.id,
        request.body.status,
      );
      return reply.send({ progress });
    },
  );
};
