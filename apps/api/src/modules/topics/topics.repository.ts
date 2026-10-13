import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { topics } from '../../db/schema.js';

export type Topic = typeof topics.$inferSelect;

function mapTopic(row: Topic) {
  return {
    ...row,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
  };
}

export function createTopicsRepository() {
  return {
    async findAll(category?: string) {
      const rows = category
        ? await db.select().from(topics).where(eq(topics.category, category))
        : await db.select().from(topics);
      return rows.map(mapTopic);
    },
    async findBySlug(slug: string) {
      const [row] = await db.select().from(topics).where(eq(topics.slug, slug));

      return row ? mapTopic(row) : null;
    },
    async create(id: string, data: Omit<typeof topics.$inferInsert, 'id'>) {
      const [row] = await db
        .insert(topics)
        .values({ id, ...data })
        .returning();

      return row ? mapTopic(row) : null;
    },
    async update(slug: string, data: Partial<typeof topics.$inferInsert>) {
      const [row] = await db
        .update(topics)
        .set({ ...data, updatedAt: new Date().toISOString() })
        .where(eq(topics.slug, slug))
        .returning();

      return row ? mapTopic(row) : null;
    },
    async delete(slug: string) {
      await db.delete(topics).where(eq(topics.slug, slug));
    },
  };
}

export type TopicsRepository = ReturnType<typeof createTopicsRepository>;
