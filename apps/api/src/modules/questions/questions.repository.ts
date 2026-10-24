import { arrayContains, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { categories, questions, topics } from '../../db/schema.js';

export type Question = typeof questions.$inferSelect;

function mapQuestion(row: Question) {
  return {
    ...row,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
  };
}

export function createQuestionsRepository() {
  return {
    async findAll(topicId?: string) {
      const rows = topicId
        ? await db
            .select()
            .from(questions)
            .where(arrayContains(questions.topicIds, [topicId]))
        : await db.select().from(questions);

      return rows.map(mapQuestion);
    },
    async findById(id: string) {
      const [row] = await db.select().from(questions).where(eq(questions.id, id));

      return row ? mapQuestion(row) : null;
    },
    async create(data: typeof questions.$inferInsert) {
      const [row] = await db.insert(questions).values(data).returning();

      return row ? mapQuestion(row) : null;
    },
    async update(id: string, data: Partial<typeof questions.$inferInsert>) {
      const [row] = await db
        .update(questions)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(questions.id, id))
        .returning();

      return row ? mapQuestion(row) : null;
    },
    async delete(id: string) {
      await db.delete(questions).where(eq(questions.id, id));
    },
    async recent(limit: number) {
      const rows = await db
        .select()
        .from(questions)
        .orderBy(desc(questions.createdAt))
        .limit(limit);

      return rows.map(mapQuestion);
    },
    async findTopicCategories(topicIds: string[]) {
      if (topicIds.length === 0) {
        return [];
      }

      return db
        .select({ id: topics.id, category: topics.category })
        .from(topics)
        .where(inArray(topics.id, topicIds));
    },
    async findCategoryNames(categorySlugs: string[]) {
      if (categorySlugs.length === 0) {
        return [];
      }

      return db
        .select({ slug: categories.slug, name: categories.name })
        .from(categories)
        .where(inArray(categories.slug, categorySlugs));
    },
  };
}

export type QuestionsRepository = ReturnType<typeof createQuestionsRepository>;
