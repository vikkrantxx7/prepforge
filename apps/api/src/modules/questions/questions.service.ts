import {
  type CreateQuestionInput,
  CreateQuestionSchema,
  type UpdateQuestionInput,
  UpdateQuestionSchema,
} from '@prepforge/shared';
import { notFoundError } from '../../lib/errors.js';
import type { QuestionsRepository } from './questions.repository.js';

const WORDS_PER_MINUTE = 225;
const DEFAULT_RECENT_LIMIT = 10;
const MIN_RECENT_LIMIT = 1;
const MAX_RECENT_LIMIT = 50;

function sanitizeTags(tags: string[]) {
  return [...new Set(tags.map((s) => s.trim().toLowerCase()).filter(Boolean))];
}

type RecentQuestionRow = Awaited<ReturnType<QuestionsRepository['recent']>>[number];

function collectReadableSegments(row: RecentQuestionRow) {
  const segments: string[] = [row.text, row.interviewerIntent ?? ''];

  if (Array.isArray(row.hints)) {
    segments.push(...row.hints.filter((hint): hint is string => typeof hint === 'string'));
  }

  if (row.answerTiers && typeof row.answerTiers === 'object') {
    const tiers = row.answerTiers as Record<string, unknown>;

    for (const value of Object.values(tiers)) {
      if (typeof value === 'string') {
        segments.push(value);
      }
    }
  }

  return segments;
}

function estimateReadMinutes(row: RecentQuestionRow) {
  const text = collectReadableSegments(row).join(' ').trim();

  if (!text) {
    return 1;
  }

  const words = text.split(/\s+/).length;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function normalizeRecentLimit(limit?: number) {
  const parsedLimit = Number.isFinite(limit) ? Number(limit) : DEFAULT_RECENT_LIMIT;

  return Math.min(MAX_RECENT_LIMIT, Math.max(MIN_RECENT_LIMIT, parsedLimit));
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

    async recent(limit?: number) {
      const safeLimit = normalizeRecentLimit(limit);
      const rows = await repo.recent(safeLimit);

      const topicIds = [...new Set(rows.flatMap((row) => row.topicIds ?? []))];
      const topicRows = await repo.findTopicCategories(topicIds);

      const categorySlugs = [...new Set(topicRows.map((row) => row.category))];
      const categoryRows = await repo.findCategoryNames(categorySlugs);

      const topicCategoryMap = new Map(topicRows.map((row) => [row.id, row.category]));
      const categoryNameMap = new Map(categoryRows.map((row) => [row.slug, row.name]));

      const questions = rows.map((row) => {
        const primaryTopicId = row.topicIds?.[0] ?? null;
        const categorySlug = primaryTopicId ? (topicCategoryMap.get(primaryTopicId) ?? null) : null;
        const categoryName = categorySlug ? (categoryNameMap.get(categorySlug) ?? null) : null;

        return {
          ...row,
          category: categorySlug,
          categoryName,
          readMinutes: estimateReadMinutes(row),
        };
      });

      return { questions };
    },
  };
}

export type QuestionsService = ReturnType<typeof createQuestionsService>;
