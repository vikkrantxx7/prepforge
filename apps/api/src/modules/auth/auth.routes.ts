import { CreateUserSchema } from '@prepforge/shared';
import type { FastifyPluginAsync } from 'fastify';
import { createAuthRepository } from './auth.repository.js';
import { createAuthService } from './auth.service.js';

export const authRoutes: FastifyPluginAsync = async (app) => {
  const repo = createAuthRepository();
  const service = createAuthService(repo, app);

  app.get('/me', { preHandler: [app.authenticate] }, async (request) => {
    return service.getProfile(request.user.userId);
  });

  app.post<{ Body: { email: string; password: string } }>('/login', async (request) => {
    const { email, password } = CreateUserSchema.parse(request.body);
    return service.login(email, password);
  });

  app.post<{ Body: { email: string; password: string } }>('/register', async (request, reply) => {
    const { email, password } = CreateUserSchema.parse(request.body);
    const result = await service.register(email, password);
    return reply.status(201).send(result);
  });
};
