import type { FastifyPluginAsync } from 'fastify';
import { createCategoriesRepository } from './categories.repository.js';
import { categoriesService } from './categories.service.js';

export const categoriesRoutes: FastifyPluginAsync = async (app) => {
  const repo = createCategoriesRepository();
  const service = await categoriesService(repo);

  app.get('/categories', async () => {
    const categories = await service.findAll();

    return categories;
  });

  app.get('/category-counts', async () => {
    return service.getCategoryCounts();
  });
};
