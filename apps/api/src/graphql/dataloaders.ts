import DataLoader from 'dataloader';
import { createProgressRepository } from '../modules/progress/progress.repository.js';

const progressRepo = createProgressRepository();

export const createProgressLoader = (userId: string) => {
  return new DataLoader(async (questionIds: readonly string[]) => {
    const progress = await progressRepo.findByUserAndQuestions(userId, questionIds);
    const progressMap = progress.reduce<Record<string, (typeof progress)[number] | null>>(
      (acc, item) => {
        acc[item.questionId] = item;
        return acc;
      },
      {},
    );
    return questionIds.map((questionId) => progressMap[questionId] ?? null);
  });
};
