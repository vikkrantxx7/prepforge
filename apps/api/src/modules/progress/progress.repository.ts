import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { userProgress } from '../../db/schema.js';

export function createProgressRepository() {
  return {
    async findByUser(userId: string) {
      return db.select().from(userProgress).where(eq(userProgress.userId, userId));
    },
    async findByUserAndQuestions(userId: string, questionIds: readonly string[]) {
      return db
        .select()
        .from(userProgress)
        .where(
          and(eq(userProgress.userId, userId), inArray(userProgress.questionId, [...questionIds])),
        );
    },
    async upsert(userId: string, questionId: string, status: string) {
      const lastSeen = new Date().toISOString();
      const [row] = await db
        .insert(userProgress)
        .values({ userId, questionId, status, lastSeen })
        .onConflictDoUpdate({
          target: [userProgress.userId, userProgress.questionId],
          set: { status, lastSeen },
        })
        .returning();
      return row ?? null;
    },
  };
}

export type ProgressRepository = ReturnType<typeof createProgressRepository>;
