import { ArrowRight, Clock3, Tag } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';

type RecentQuestion = {
  id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  text: string;
  minutes: number;
  addedDaysAgo: number;
};

const recentlyAdded: RecentQuestion[] = [
  {
    id: 'react-reconciliation-scenarios',
    difficulty: 'Medium',
    category: 'React',
    text: "How does React's reconciliation algorithm work?",
    minutes: 8,
    addedDaysAgo: 2,
  },
  {
    id: 'event-loop-priority-puzzle',
    difficulty: 'Medium',
    category: 'JavaScript',
    text: 'Explain the event loop in JavaScript.',
    minutes: 10,
    addedDaysAgo: 4,
  },
  {
    id: 'system-design-url-shortener',
    difficulty: 'Medium',
    category: 'System Design',
    text: 'Design a URL Shortening Service.',
    minutes: 15,
    addedDaysAgo: 4,
  },
];

const difficultyClasses: Record<RecentQuestion['difficulty'], string> = {
  Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
  Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
  Hard: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200',
};

export const RecentlyAddedSection = () => {
  const featured = recentlyAdded[1];

  if (!featured) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="hidden font-heading text-3xl font-semibold md:block">Recently Added</h2>
          <h2 className="font-heading text-3xl font-semibold md:hidden">Featured Question</h2>
          <p className="text-sm text-muted-foreground">
            Check out the latest questions added to help you practice.
          </p>
        </div>
        <Link
          href={'/topics' as Route}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80"
        >
          <span className="hidden md:inline">View All Questions</span>
          <span className="md:hidden">View All</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="hidden grid-cols-3 gap-4 md:grid">
        {recentlyAdded.map((question) => (
          <Link
            key={question.id}
            href={'/topics' as Route}
            className="rounded-2xl border border-border/80 bg-card/80 p-5 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyClasses[question.difficulty]}`}
              >
                {question.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                {question.category}
              </span>
            </div>

            <p className="mb-2 min-h-14 text-2xl leading-tight font-semibold text-foreground">
              {question.text}
            </p>
            <p className="mb-5 text-sm text-muted-foreground">
              Understand key concepts and walk through a practical explanation strategy.
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {question.minutes} min
              </span>
              <span>Added {question.addedDaysAgo} days ago</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/80 p-4 md:hidden">
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="inline-flex rounded-full bg-accent/15 px-2.5 py-1 font-semibold text-accent">
            {featured.difficulty}
          </span>
          <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
            {featured.category}
          </span>
        </div>

        <p className="mb-2 text-3xl leading-tight font-semibold text-foreground">{featured.text}</p>
        <p className="mb-5 text-sm text-muted-foreground">
          Understand how JavaScript handles asynchronous operations using the event loop, call
          stack, task queue and microtask queue.
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {featured.minutes} min read
          </span>
          <span className="inline-flex items-center gap-1">
            <Tag className="h-3.5 w-3.5" />
            Added {featured.addedDaysAgo} days ago
          </span>
        </div>

        <div className="mt-4 flex justify-end">
          <Link
            href={'/topics' as Route}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Open featured question</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
