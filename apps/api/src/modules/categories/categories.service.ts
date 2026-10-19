import type { CategoriesRepository } from './categories.repository.js';

export const categoriesService = async (repo: CategoriesRepository) => {
  return {
    findAll: async () => {
      return repo.findAll();
    },

    async getCategoryCounts() {
      const categoryCounts = await repo.findCategoryCounts();
      return { categoryCounts };
    },
  };
};

export type CategoriesService = ReturnType<typeof categoriesService>;
