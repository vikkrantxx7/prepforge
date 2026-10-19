import { API_V1_URL } from '@/shared/config/api';

type TopicApiModel = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  createdAt: string;
  updatedAt: string | null;
};

type TopicsResponse = {
  topics: TopicApiModel[];
};

const LANDING_REVALIDATE_SECONDS = 60;

export const topicsApi = {
  list: async (category?: string) => {
    const url = new URL(`${API_V1_URL}/topics`);

    if (category !== undefined) {
      url.searchParams.append('category', category);
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: LANDING_REVALIDATE_SECONDS },
    });

    return response.json() as Promise<TopicsResponse>;
  },
};
