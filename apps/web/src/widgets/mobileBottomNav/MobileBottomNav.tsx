'use client';

import { BookOpen, House, ChartColumnBig, UserRound } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

const items = [
  { label: 'Home', href: '/', icon: House },
  { label: 'Topics', href: '/topics', icon: BookOpen },
  { label: 'Practice', href: '/practice', icon: ChartColumnBig },
  { label: 'Profile', href: '/profile', icon: UserRound },
] as const;

export const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 border-t border-border/80 bg-background/95 px-3 py-2 backdrop-blur-sm md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href as Route}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs transition-colors',
                  isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
