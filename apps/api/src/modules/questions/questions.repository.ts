import { arrayContains, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { questions } from '../../db/schema.js';

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
  };
}

export type QuestionsRepository = ReturnType<typeof createQuestionsRepository>;
