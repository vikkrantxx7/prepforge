import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { categories, questions, topics } from '../../db/schema.js';

export const createCategoriesRepository = () => ({
  findAll: async () => {
    return db.select().from(categories);
  },
  async findCategoryCounts() {
    const categoryRows = await db
      .select({ slug: categories.slug, name: categories.name, description: categories.description })
      .from(categories)
      .orderBy(asc(categories.slug));

    const topicRows = await db.select({ id: topics.id, category: topics.category }).from(topics);
    const topicsCountByCategory = topicRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.category] = (acc[row.category] ?? 0) + 1;
      return acc;
    }, {});

    const topicCategoryById = topicRows.reduce<Record<string, string>>((acc, row) => {
      acc[row.id] = row.category;
      return acc;
    }, {});

    const questionRows = await db
      .select({ id: questions.id, topicIds: questions.topicIds })
      .from(questions)
      .where(eq(questions.status, 'published'));
    const questionIdsByCategory = questionRows.reduce<Record<string, Set<string>>>((acc, row) => {
      const categorySlugs = new Set<string>();

      for (const topicId of row.topicIds ?? []) {
        const category = topicCategoryById[topicId];
        if (category) {
          categorySlugs.add(category);
        }
      }

      for (const category of categorySlugs) {
        acc[category] ??= new Set<string>();
        acc[category].add(row.id);
      }

      return acc;
    }, {});

    return categoryRows.map((row) => ({
      category: row.slug,
      name: row.name,
      description: row.description,
      topicsCount: topicsCountByCategory[row.slug] ?? 0,
      questionsCount: questionIdsByCategory[row.slug]?.size ?? 0,
    }));
  },
});

export type CategoriesRepository = ReturnType<typeof createCategoriesRepository>;
