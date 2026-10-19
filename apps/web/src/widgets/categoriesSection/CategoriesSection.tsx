import { ArrowRight, BookOpenCheck, Boxes, Cpu, Database, FileText } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/Card';
import { CardSkeleton } from '@/shared/ui/CardSkeleton';

type Category = {
  name: string;
  description: string;
  topicCount: number;
  questionCount: number;
  icon: ComponentType<{ className?: string }>;
};

const categories: Category[] = [
  {
    name: 'JavaScript',
    description: 'Core concepts, ES6+, async, and more.',
    topicCount: 42,
    questionCount: 320,
    icon: Cpu,
  },
  {
    name: 'React',
    description: 'Components, hooks, state management, etc.',
    topicCount: 38,
    questionCount: 280,
    icon: Boxes,
  },
  {
    name: 'Node.js',
    description: 'Runtime, APIs, databases, auth, and more.',
    topicCount: 36,
    questionCount: 260,
    icon: Database,
  },
  {
    name: 'System Design',
    description: 'Architecture, scalability, databases, and more.',
    topicCount: 28,
    questionCount: 180,
    icon: BookOpenCheck,
  },
];

export const CategoriesSection = () => {
  // Temporary toggle for loading-state UI preview.
  const isLoading = false;
  const fallbackSkeletonKeys = [
    'category-skeleton-1',
    'category-skeleton-2',
    'category-skeleton-3',
    'category-skeleton-4',
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="hidden font-heading text-3xl font-semibold md:block">
            Explore Categories
          </h2>
          <h2 className="font-heading text-3xl font-semibold md:hidden">Popular Topics</h2>
          <p className="text-sm text-muted-foreground">
            Choose a topic and start practicing with curated questions.
          </p>
        </div>
        <Link
          href={'/topics' as Route}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80"
        >
          <span className="hidden md:inline">View All Topics</span>
          <span className="md:hidden">View All</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pt-1 pb-1 md:mx-0 md:overflow-visible md:px-0">
        <div className="flex w-max gap-3 md:grid md:w-full md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {isLoading
            ? fallbackSkeletonKeys.map((key) => (
                <CardSkeleton
                  key={key}
                  className="h-full w-[16rem] bg-card/80 p-4 md:w-auto md:p-5"
                />
              ))
            : categories.map((category) => {
                const Icon = category.icon;

                return (
                  <Link
                    key={category.name}
                    href={`/topics?category=${encodeURIComponent(category.name)}` as Route}
                    className="group w-[16rem] md:w-auto"
                  >
                    <Card className="relative h-full rounded-2xl bg-card/80 p-4 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:ring-accent/50 md:p-5">
                      <CardHeader className="gap-0 p-0">
                        <div className="mb-4 inline-flex w-fit rounded-lg border border-accent/30 bg-accent/12 p-2.5 text-accent">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="absolute top-4 right-4 hidden h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-background/70 text-muted-foreground transition-colors group-hover:text-foreground md:flex">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>

                        <CardTitle className="mb-1 text-lg">{category.name}</CardTitle>
                        <CardDescription className="mb-4 leading-relaxed">
                          {category.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-0 md:hidden">
                        <p className="text-sm text-muted-foreground">
                          {category.questionCount} questions
                        </p>
                      </CardContent>

                      <CardFooter className="hidden items-center gap-4 p-0 text-xs text-muted-foreground md:flex">
                        <span className="inline-flex items-center gap-1">
                          <BookOpenCheck className="h-3.5 w-3.5" />
                          {category.topicCount} Topics
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          {category.questionCount} Questions
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
};
