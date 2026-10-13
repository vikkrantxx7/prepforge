import { ArrowRight, BookOpen, Code2, Play, Search, Sparkles, Users } from 'lucide-react';
import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useId } from 'react';
import { buttonVariants } from '@/shared/ui/Button';

const stats = [
  { label: 'Curated Questions', value: '1,500+', icon: Code2 },
  { label: 'Technical Topics', value: '15+', icon: BookOpen },
  { label: 'Developers Learning', value: '10K+', icon: Users },
] as const;

export const HeroSection = () => {
  const searchId = useId();

  return (
    <section className="relative isolate overflow-hidden border-b border-border/70">
      <div className="absolute inset-0 -z-20 md:hidden dark:hidden">
        <Image
          src="/mobile-hero-light.png"
          alt="Astronaut floating in space"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 -z-20 hidden md:block dark:hidden">
        <Image
          src="/hero-light.png"
          alt="Astronaut floating in space"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 -z-20 hidden dark:block md:hidden">
        <Image
          src="/mobile-hero-dark.png"
          alt="Astronaut floating in space"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 -z-20 hidden dark:md:block">
        <Image
          src="/hero-dark.png"
          alt="Astronaut floating in space"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-linear-to-b from-background/58 via-background/70 to-background/88 dark:hidden md:from-background/45 md:via-background/58 md:to-background/80" />
      <div className="absolute inset-0 -z-10 hidden bg-linear-to-b from-background/72 via-background/84 to-background dark:block md:from-background/62 md:via-background/76" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pt-6 pb-10 md:px-6 md:pt-16 md:pb-14">
        <div className="mb-2 flex items-center gap-2 md:hidden">
          <Sparkles className="h-6 w-6 text-accent" />
          <div className="leading-tight">
            <p className="text-2xl font-bold">
              Prep<span className="text-accent">Forge</span>
            </p>
            <p className="text-xs text-muted-foreground">Practice. Learn. Grow.</p>
          </div>
        </div>

        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-background/35 px-3 py-1 text-[11px] font-semibold tracking-wide text-foreground uppercase backdrop-blur-sm md:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Practice{' '}
          <span className="text-muted-foreground">Learn</span>{' '}
          <span className="text-muted-foreground">Grow</span>
        </p>

        <div className="max-w-3xl space-y-4 md:space-y-5">
          <h1 className="font-heading text-5xl leading-[0.98] font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Sharpen Your Skills. Build a <span className="text-accent">Stronger You.</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-2xl">
            Curated questions, real-world scenarios and structured learning paths to help you
            prepare for developer interviews and grow your engineering skills.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <Link
            href={'/topics' as Route}
            className={buttonVariants({ size: 'lg', className: 'h-12 gap-2 px-5 text-base' })}
          >
            <Play className="h-4 w-4" />
            Start Practicing
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={'/topics' as Route}
            className={buttonVariants({
              size: 'lg',
              variant: 'outline',
              className: 'h-12 gap-2 px-5 text-base bg-background/35 backdrop-blur-sm',
            })}
          >
            <BookOpen className="h-4 w-4" />
            Explore Topics
          </Link>
        </div>

        <div className="mt-1 rounded-2xl border border-border/70 bg-card/45 p-3 backdrop-blur-sm md:hidden">
          <label htmlFor={searchId} className="sr-only">
            Search topics or questions
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              id={searchId}
              type="text"
              placeholder="Search questions, topics..."
              className="h-11 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="mt-1 grid grid-cols-3 gap-2 rounded-2xl border border-border/70 bg-card/55 p-3 backdrop-blur-sm md:hidden">
          {stats.map((item) => (
            <div key={item.label} className="text-center">
              <item.icon className="mx-auto mb-1 h-4 w-4 text-accent" />
              <p className="text-lg font-semibold text-foreground">{item.value}</p>
              <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="hidden md:grid md:max-w-152 md:grid-cols-3 md:gap-2 md:rounded-2xl md:border md:border-border/70 md:bg-card/40 md:p-3 md:backdrop-blur-sm">
          {stats.map((item) => (
            <div key={item.label} className="text-center">
              <item.icon className="mx-auto mb-1 h-4 w-4 text-accent" />
              <p className="text-lg font-semibold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
