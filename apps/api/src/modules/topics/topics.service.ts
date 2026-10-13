import {
  type CreateTopicInput,
  CreateTopicSchema,
  type UpdateTopicInput,
  UpdateTopicSchema,
} from '@prepforge/shared';
import { conflictError, isPgError, notFoundError } from '../../lib/errors.js';
import type { TopicsRepository } from './topics.repository.js';

export function createTopicsService(repo: TopicsRepository) {
  return {
    async list(category?: string) {
      return { topics: await repo.findAll(category) };
    },

    async get(slug: string) {
      const topic = await repo.findBySlug(slug);

      if (!topic) throw notFoundError('Topic not found');

      return { topic };
    },

    async create(input: CreateTopicInput) {
      const parsed = CreateTopicSchema.parse(input);
      const id = crypto.randomUUID();
      try {
        const topic = await repo.create(id, parsed);
        if (!topic) throw new Error('Failed to create topic');

        return { topic };
      } catch (err) {
        if (isPgError(err, '23505')) throw conflictError('Slug already exists');
        throw err;
      }
    },

    async update(slug: string, input: UpdateTopicInput) {
      const existing = await repo.findBySlug(slug);
      if (!existing) throw notFoundError('Topic not found');
      const parsed = UpdateTopicSchema.parse(input);
      try {
        const topic = await repo.update(slug, parsed);
        if (!topic) throw new Error('Failed to update topic');
        return { topic };
      } catch (err) {
        if (isPgError(err, '23505')) throw conflictError('Slug already exists');
        throw err;
      }
    },

    async delete(slug: string) {
      const existing = await repo.findBySlug(slug);

      if (!existing) throw notFoundError('Topic not found');

      await repo.delete(slug);
    },
  };
}

export type TopicsService = ReturnType<typeof createTopicsService>;
