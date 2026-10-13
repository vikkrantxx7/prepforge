import { progressSchema } from '@prepforge/shared';
import { isPgError } from '../../lib/errors.js';
import type { ProgressRepository } from './progress.repository.js';

export function createProgressService(repo: ProgressRepository) {
  return {
    async getProgress(userId?: string) {
      if (!userId) return [];

      return repo.findByUser(userId);
    },

    async updateProgress(userId: string, questionId: string, status: string) {
      const parsed = progressSchema.parse({ userId, questionId, status });
      try {
        return await repo.upsert(parsed.userId, parsed.questionId, parsed.status);
      } catch (err) {
        if (isPgError(err, '23503')) throw new Error('Invalid user or question ID');
        throw err;
      }
    },
  };
}

export type ProgressService = ReturnType<typeof createProgressService>;
