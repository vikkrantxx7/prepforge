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

type Category = {
  category: string;
  name: string;
  description: string;
  topicsCount: number;
  questionsCount: number;
};

const categoryIconMap: Record<string, ComponentType<{ className?: string }>> = {
  javascript: Cpu,
  react: Boxes,
  nodejs: Database,
  'node.js': Database,
  'system-design': BookOpenCheck,
};

const resolveCategoryIcon = (categorySlug: string) => {
  return categoryIconMap[categorySlug] ?? BookOpenCheck;
};

export const CategoriesSection = ({ categories }: { categories: Category[] }) => {
  const categoryItems = categories ?? [];

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
          {categoryItems.map((category) => {
            const Icon = resolveCategoryIcon(category.category);

            return (
              <Link
                key={category.name}
                href={`/topics?category=${encodeURIComponent(category.category)}` as Route}
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
                      {category.questionsCount} questions
                    </p>
                  </CardContent>

                  <CardFooter className="hidden items-center gap-4 p-0 text-xs text-muted-foreground md:flex">
                    <span className="inline-flex items-center gap-1">
                      <BookOpenCheck className="h-3.5 w-3.5" />
                      {category.topicsCount} Topics
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      {category.questionsCount} Questions
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
