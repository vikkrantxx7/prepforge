import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const shouldSeed = process.argv.includes('--seed');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function resetDatabase() {
  await db.execute(sql`
    TRUNCATE TABLE
      "user_progress",
      "questions",
      "topics",
      "categories",
      "users"
    RESTART IDENTITY CASCADE
  `);
}

async function seedDatabase() {
  const categoryRows = [
    {
      id: crypto.randomUUID(),
      slug: 'javascript',
      name: 'JavaScript',
      description: 'Core concepts, ES6+, async patterns and browser fundamentals.',
    },
    {
      id: crypto.randomUUID(),
      slug: 'react',
      name: 'React',
      description: 'Component design, hooks, rendering, and state architecture.',
    },
    {
      id: crypto.randomUUID(),
      slug: 'nodejs',
      name: 'Node.js',
      description: 'Runtime internals, APIs, networking, and server-side patterns.',
    },
    {
      id: crypto.randomUUID(),
      slug: 'system-design',
      name: 'System Design',
      description: 'Architecture, scalability, consistency, and distributed systems trade-offs.',
    },
  ];

  await db.insert(schema.categories).values(categoryRows);

  const jsEventLoopTopicId = crypto.randomUUID();
  const reactReconciliationTopicId = crypto.randomUUID();
  const nodeEventLoopTopicId = crypto.randomUUID();
  const urlShortenerTopicId = crypto.randomUUID();

  const topicRows = [
    {
      id: jsEventLoopTopicId,
      slug: 'js-event-loop',
      name: 'JavaScript Event Loop',
      category: 'javascript',
      description: 'Call stack, task queue, microtasks and scheduling behavior.',
    },
    {
      id: reactReconciliationTopicId,
      slug: 'react-reconciliation',
      name: 'React Reconciliation',
      category: 'react',
      description: 'How React diffs trees and applies efficient UI updates.',
    },
    {
      id: nodeEventLoopTopicId,
      slug: 'node-event-loop',
      name: 'Node.js Event Loop',
      category: 'nodejs',
      description: 'libuv phases and server-side event loop behavior.',
    },
    {
      id: urlShortenerTopicId,
      slug: 'url-shortener',
      name: 'URL Shortener Design',
      category: 'system-design',
      description: 'Designing a scalable URL shortener end-to-end.',
    },
  ];

  await db.insert(schema.topics).values(topicRows);

  await db.insert(schema.questions).values([
    {
      id: crypto.randomUUID(),
      text: 'Explain the JavaScript event loop and microtask queue ordering.',
      topicIds: [jsEventLoopTopicId],
      status: 'published',
      tags: ['javascript', 'async'],
      recency: 'recent',
    },
    {
      id: crypto.randomUUID(),
      text: "How does React's reconciliation algorithm work?",
      topicIds: [reactReconciliationTopicId],
      status: 'published',
      tags: ['react', 'rendering'],
      recency: 'recent',
    },
    {
      id: crypto.randomUUID(),
      text: 'Design a URL shortening service and discuss trade-offs.',
      topicIds: [urlShortenerTopicId],
      status: 'published',
      tags: ['system-design'],
      recency: 'classic',
    },
  ]);
}

try {
  await resetDatabase();
  console.log('Database reset completed.');

  if (shouldSeed) {
    await seedDatabase();
    console.log('Seed data inserted.');
  }
} catch (error) {
  console.error('Database reset failed.', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
