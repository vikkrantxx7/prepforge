'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Topics', href: '/topics' },
  { label: 'Progress', href: '/progress' },
] as const;

export const NavbarLinks = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6 md:flex">
      {links.map(({ label, href }) => (
        <Link
          key={href}
          href={href as Route}
          className={cn(
            'text-sm transition-colors hover:text-foreground',
            pathname === href
              ? 'border-b-2 border-accent font-medium text-foreground'
              : 'text-muted-foreground',
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};
