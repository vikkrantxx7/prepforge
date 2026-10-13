import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';

export function createAuthRepository() {
  return {
    async findByEmail(email: string) {
      const [user] = await db.select().from(users).where(eq(users.email, email));

      return user ?? null;
    },
    async findById(id: string) {
      const [user] = await db.select().from(users).where(eq(users.id, id));

      return user ?? null;
    },
    async create(id: string, email: string, passwordHash: string) {
      const [user] = await db.insert(users).values({ id, email, passwordHash }).returning();

      return user ?? null;
    },
  };
}

export type AuthRepository = ReturnType<typeof createAuthRepository>;
