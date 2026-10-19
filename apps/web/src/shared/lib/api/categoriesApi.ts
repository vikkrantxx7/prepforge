import { API_V1_URL } from '@/shared/config/api';

const LANDING_REVALIDATE_SECONDS = 60;

export const categoriesApi = {
  categoryCounts: async () => {
    const url = new URL(`${API_V1_URL}/categories/category-counts`);

    const response = await fetch(url.toString(), {
      next: { revalidate: LANDING_REVALIDATE_SECONDS },
    });

    return response.json() as Promise<{
      categoryCounts: {
        category: string;
        name: string;
        description: string;
        topicsCount: number;
        questionsCount: number;
      }[];
    }>;
  },
};
