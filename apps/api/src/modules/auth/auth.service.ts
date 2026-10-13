import bcrypt from 'bcrypt';
import type { FastifyInstance } from 'fastify';
import { notFoundError, unauthorizedError } from '../../lib/errors.js';
import type { AuthRepository } from './auth.repository.js';

export function createAuthService(repo: AuthRepository, app: FastifyInstance) {
  return {
    async register(email: string, password: string) {
      const id = crypto.randomUUID();
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await repo.create(id, email, passwordHash);

      if (!user) throw new Error('Failed to create user');

      return { email: user.email, role: user.role };
    },

    async login(email: string, password: string) {
      const user = await repo.findByEmail(email);

      if (!user) throw unauthorizedError('Invalid email or password');

      const valid = await bcrypt.compare(password, user.passwordHash);

      if (!valid) throw unauthorizedError('Invalid email or password');

      const token = app.jwt.sign({ role: user.role, userId: user.id });

      return { token };
    },

    async getProfile(userId: string) {
      const user = await repo.findById(userId);

      if (!user) throw notFoundError('User not found');

      return { email: user.email, role: user.role };
    },
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
