import type { CreateQuestionInput, UpdateQuestionInput } from '@prepforge/shared';
import type { FastifyPluginAsync } from 'fastify';
import { createQuestionsRepository } from './questions.repository.js';
import { createQuestionsService } from './questions.service.js';

export const questionsRoutes: FastifyPluginAsync = async (app) => {
  const repo = createQuestionsRepository();
  const service = createQuestionsService(repo);

  app.get<{ Querystring: { topicId?: string } }>('/', async (request) => {
    return service.list(request.query.topicId);
  });

  app.post<{ Body: CreateQuestionInput }>(
    '/',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const result = await service.create(request.body);

      return reply.status(201).send(result);
    },
  );

  app.get<{ Params: { id: string } }>('/:id', async (request) => {
    return service.get(request.params.id);
  });

  app.patch<{ Params: { id: string }; Body: UpdateQuestionInput }>(
    '/:id',
    { preHandler: [app.authenticate] },
    async (request) => {
      return service.update(request.params.id, request.body);
    },
  );

  app.delete<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      await service.delete(request.params.id);

      return reply.status(204).send();
    },
  );

  app.post<{ Params: { id: string } }>(
    '/:id/publish',
    { preHandler: [app.authenticate] },
    async (request) => {
      return service.setStatus(request.params.id, 'published');
    },
  );

  app.post<{ Params: { id: string } }>(
    '/:id/unpublish',
    { preHandler: [app.authenticate] },
    async (request) => {
      return service.setStatus(request.params.id, 'draft');
    },
  );

  app.get<{ Querystring: { limit?: number } }>('/recent', async (request) => {
    const limit = request.query.limit;

    return service.recent(limit);
  });
};
