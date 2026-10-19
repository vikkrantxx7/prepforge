import { API_V1_URL } from '@/shared/config/api';

type QuestionDifficultyContext = {
  role: 'junior' | 'mid' | 'senior';
  company: 'startup' | 'midsize' | 'faang';
  difficulty: 'easy' | 'medium' | 'hard';
};

export type QuestionApiModel = {
  id: string;
  text: string;
  topicIds: string[] | null;
  difficultyContext: QuestionDifficultyContext[] | null;
  status: string;
  createdAt: string;
};

type RecentQuestionsResponse = {
  questions: QuestionApiModel[];
};

const LANDING_REVALIDATE_SECONDS = 60;

export const questionsApi = {
  recent: async (limit?: number) => {
    const url = new URL(`${API_V1_URL}/questions/recent`);

    if (limit !== undefined) {
      url.searchParams.append('limit', limit.toString());
    }
    const response = await fetch(url.toString(), {
      next: { revalidate: LANDING_REVALIDATE_SECONDS },
    });

    return response.json() as Promise<RecentQuestionsResponse>;
  },
};
