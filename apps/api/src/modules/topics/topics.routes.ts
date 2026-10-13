import type { CreateTopicInput, UpdateTopicInput } from '@prepforge/shared';
import type { FastifyPluginAsync } from 'fastify';
import { createTopicsRepository } from './topics.repository.js';
import { createTopicsService } from './topics.service.js';

export const topicsRoutes: FastifyPluginAsync = async (app) => {
  const repo = createTopicsRepository();
  const service = createTopicsService(repo);

  app.get<{ Querystring: { category?: string } }>('/', async (request) => {
    return service.list(request.query.category);
  });

  app.post<{ Body: CreateTopicInput }>(
    '/',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const result = await service.create(request.body);
      return reply.status(201).send(result);
    },
  );

  app.get<{ Params: { slug: string } }>('/:slug', async (request) => {
    return service.get(request.params.slug);
  });

  app.patch<{ Params: { slug: string }; Body: UpdateTopicInput }>(
    '/:slug',
    { preHandler: [app.authenticate] },
    async (request) => {
      return service.update(request.params.slug, request.body);
    },
  );

  app.delete<{ Params: { slug: string } }>(
    '/:slug',
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      await service.delete(request.params.slug);
      return reply.status(204).send();
    },
  );
};
