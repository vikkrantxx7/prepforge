import cors from '@fastify/cors';
import Fastify from 'fastify';
import { isConflictError, isNotFoundError, isPgError, isUnauthorizedError } from './lib/errors.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { progressRoutes } from './modules/progress/progress.routes.js';
import { questionsRoutes } from './modules/questions/questions.routes.js';
import { topicsRoutes } from './modules/topics/topics.routes.js';
import { graphqlPlugin } from './plugins/graphql.js';
import { jwtPlugin } from './plugins/jwt.js';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  });

  app.get('/health', async () => {
    return { status: 'ok' };
  });

  app.register(jwtPlugin);
  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(topicsRoutes, { prefix: '/api/v1/topics' });
  app.register(progressRoutes, { prefix: '/api/v1' });
  app.register(questionsRoutes, { prefix: '/api/v1/questions' });
  app.register(graphqlPlugin);

  app.setErrorHandler((error, _request, reply) => {
    if (isNotFoundError(error)) return reply.status(404).send({ error: error.message });
    if (isConflictError(error)) return reply.status(409).send({ error: error.message });
    if (isUnauthorizedError(error)) return reply.status(401).send({ error: error.message });
    if (isPgError(error, '23505')) return reply.status(409).send({ error: 'Already exists' });
    if (isPgError(error, '23503'))
      return reply.status(404).send({ error: 'Referenced entity not found' });
    app.log.error(error);
    return reply.status(500).send({ error: 'Internal server error' });
  });

  return app;
}
