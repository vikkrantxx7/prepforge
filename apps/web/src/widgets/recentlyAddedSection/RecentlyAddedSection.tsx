import { ArrowRight, Clock3 } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/Card';
import { resolveCategoryIcon } from '@/shared/ui/icons/categoryIconMap';

type RecentQuestion = {
  id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  categoryName: string;
  text: string;
  minutes: number;
  addedDaysAgo: number;
};

const difficultyClasses: Record<RecentQuestion['difficulty'], string> = {
  Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
  Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
  Hard: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200',
};

export const RecentlyAddedSection = ({ questions }: { questions: RecentQuestion[] }) => {
  const recentQuestions = questions ?? [];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="hidden font-heading text-3xl font-semibold md:block">Recently Added</h2>
          <h2 className="font-heading text-3xl font-semibold md:hidden">Recently Added</h2>
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
        {recentQuestions.map((question) => {
          const Icon = resolveCategoryIcon(question.category);

          return (
            <Link key={question.id} href={'/topics' as Route} className="group">
              <Card className="h-full rounded-2xl bg-card/80 py-5 ring-border/80 transition-all group-hover:-translate-y-0.5 group-hover:ring-accent/50 group-hover:shadow-lg [--card-spacing:--spacing(5)]">
                <CardHeader className="gap-0">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyClasses[question.difficulty]}`}
                    >
                      {question.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {question.categoryName}
                    </span>
                  </div>

                  <CardTitle className="mb-2 min-h-14 text-2xl leading-tight font-semibold text-foreground">
                    {question.text}
                  </CardTitle>
                  <CardDescription className="mb-5 text-sm">
                    Understand key concepts and walk through a practical explanation strategy.
                  </CardDescription>
                </CardHeader>

                <CardFooter className="justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {question.minutes} min
                  </span>
                  <span>Added {question.addedDaysAgo} days ago</span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 md:hidden">
        {recentQuestions.map((question) => {
          const Icon = resolveCategoryIcon(question.category);

          return (
            <Link
              key={question.id}
              href={'/topics' as Route}
              className="group w-[min(85vw,26rem)] shrink-0 snap-start"
            >
              <Card className="h-full rounded-2xl bg-card/80 py-4 ring-border/80 transition-all group-hover:-translate-y-0.5 group-hover:ring-accent/50 group-hover:shadow-lg [--card-spacing:--spacing(4)]">
                <CardHeader className="gap-0">
                  <div className="mb-3 flex items-center justify-between gap-2 text-xs">
                    <span
                      className={`rounded-full px-2.5 py-1 font-semibold ${difficultyClasses[question.difficulty]}`}
                    >
                      {question.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {question.categoryName}
                    </span>
                  </div>

                  <CardTitle className="mb-2 text-2xl leading-tight font-semibold text-foreground">
                    {question.text}
                  </CardTitle>
                  <CardDescription className="mb-5 text-sm">
                    Understand key concepts and walk through a practical explanation strategy.
                  </CardDescription>
                </CardHeader>

                <CardFooter className="justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {question.minutes} min
                  </span>
                  <span>Added {question.addedDaysAgo} days ago</span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
