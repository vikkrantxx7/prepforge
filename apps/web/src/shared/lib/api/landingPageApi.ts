import { categoriesApi } from './categoriesApi';
import { questionsApi } from './questionsApi';

export type CategoryCardDto = {
  category: string;
  name: string;
  description: string;
  topicsCount: number;
  questionsCount: number;
};

export type RecentQuestionsDto = {
  id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  text: string;
  minutes: number;
  addedDaysAgo: number;
};

const difficultyLabelMap = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
} as const;

const getAddedDaysAgo = (createdAt: string) => {
  const createdAtMs = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtMs)) {
    return 0;
  }

  const nowMs = Date.now();
  const diffMs = Math.max(nowMs - createdAtMs, 0);
  const dayMs = 24 * 60 * 60 * 1000;

  return Math.floor(diffMs / dayMs);
};

const mapRecentQuestions = (
  questions: Awaited<ReturnType<typeof questionsApi.recent>>['questions'],
): RecentQuestionsDto[] => {
  return questions.map((question) => {
    const difficulty = question.difficultyContext?.[0]?.difficulty ?? 'medium';

    return {
      id: question.id,
      difficulty: difficultyLabelMap[difficulty],
      category: 'General',
      text: question.text,
      minutes: 8,
      addedDaysAgo: getAddedDaysAgo(question.createdAt),
    };
  });
};

export const landingPageApi = {
  data: async () => {
    const [{ categoryCounts }, { questions }] = await Promise.all([
      categoriesApi.categoryCounts(),
      questionsApi.recent(),
    ]);

    return { categories: categoryCounts, questions: mapRecentQuestions(questions) };
  },
};
