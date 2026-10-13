import type DataLoader from 'dataloader';
import { UNAUTHORIZED_ERROR } from '../constants/errors.js';
import type { userProgress } from '../db/schema.js';
import { createProgressRepository } from '../modules/progress/progress.repository.js';
import { createProgressService } from '../modules/progress/progress.service.js';
import { createQuestionsRepository } from '../modules/questions/questions.repository.js';
import { createQuestionsService } from '../modules/questions/questions.service.js';
import { createTopicsRepository } from '../modules/topics/topics.repository.js';
import { createTopicsService } from '../modules/topics/topics.service.js';

const topicsService = createTopicsService(createTopicsRepository());
const questionsService = createQuestionsService(createQuestionsRepository());
const progressService = createProgressService(createProgressRepository());

export const resolvers = {
  Query: {
    topics: async (_: unknown, { category }: { category?: string }) => {
      const result = await topicsService.list(category);

      return result.topics;
    },
    topic: async (_: unknown, { slug }: { slug: string }) => {
      try {
        const result = await topicsService.get(slug);

        return result.topic;
      } catch {
        return null;
      }
    },
    questions: async (_: unknown, { topicId }: { topicId?: string }) => {
      const result = await questionsService.list(topicId);

      return result.questions;
    },
    question: async (_: unknown, { questionId }: { questionId: string }) => {
      try {
        const result = await questionsService.get(questionId);

        return result.question;
      } catch {
        return null;
      }
    },
    myProgress: async (_: unknown, __: unknown, context: { user?: { userId: string } }) => {
      return progressService.getProgress(context.user?.userId);
    },
  },
  Question: {
    progress: async (
      parent: { id: string },
      _: unknown,
      context: {
        progressLoader: DataLoader<string, (typeof userProgress)[] | null> | null;
      },
    ) => {
      if (!context.progressLoader) return null;

      return context.progressLoader.load(parent.id);
    },
  },
  Mutation: {
    updateProgress: async (
      _: unknown,
      { questionId, status }: { questionId: string; status: string },
      context: { user?: { userId: string } },
    ) => {
      if (!context.user) throw new Error(UNAUTHORIZED_ERROR);

      return progressService.updateProgress(context.user.userId, questionId, status);
    },
  },
};
