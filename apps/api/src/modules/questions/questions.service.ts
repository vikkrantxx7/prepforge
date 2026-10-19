import {
  type CreateQuestionInput,
  CreateQuestionSchema,
  type UpdateQuestionInput,
  UpdateQuestionSchema,
} from '@prepforge/shared';
import { notFoundError } from '../../lib/errors.js';
import type { QuestionsRepository } from './questions.repository.js';

function sanitizeTags(tags: string[]) {
  return [...new Set(tags.map((s) => s.trim().toLowerCase()).filter(Boolean))];
}

export function createQuestionsService(repo: QuestionsRepository) {
  return {
    async list(topicId?: string) {
      return { questions: await repo.findAll(topicId) };
    },

    async get(id: string) {
      const question = await repo.findById(id);
      if (!question) throw notFoundError('Question not found');

      return { question };
    },

    async create(input: CreateQuestionInput) {
      const parsed = CreateQuestionSchema.parse(input);
      const question = await repo.create({
        id: crypto.randomUUID(),
        ...parsed,
        tags: sanitizeTags(parsed.tags),
        status: 'draft',
      });

      if (!question) throw new Error('Failed to create question');

      return { question };
    },

    async update(id: string, input: UpdateQuestionInput) {
      const existing = await repo.findById(id);

      if (!existing) throw notFoundError('Question not found');

      const parsed = UpdateQuestionSchema.parse(input);
      const question = await repo.update(id, {
        ...parsed,
        ...(parsed.tags !== undefined && { tags: sanitizeTags(parsed.tags) }),
      });

      if (!question) throw new Error('Failed to update question');

      return { question };
    },

    async delete(id: string) {
      const existing = await repo.findById(id);
      if (!existing) throw notFoundError('Question not found');
      await repo.delete(id);
    },

    async setStatus(id: string, status: 'published' | 'draft') {
      const existing = await repo.findById(id);
      if (!existing) throw notFoundError('Question not found');
      const question = await repo.update(id, { status });
      if (!question) throw new Error('Failed to update question status');
      return { question };
    },

    async recent(limit: number = 10) {
      return { questions: await repo.recent(limit) };
    },
  };
}

export type QuestionsService = ReturnType<typeof createQuestionsService>;
