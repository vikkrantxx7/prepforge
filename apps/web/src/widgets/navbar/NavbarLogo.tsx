import { Rocket } from 'lucide-react';
import Link from 'next/link';

export const NavbarLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Rocket className="h-6 w-6 text-accent" />
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-bold">
          Prep<span className="text-accent">Forge</span>
        </span>
        <span className="hidden text-xs text-muted-foreground md:block">
          Your guide to prepare to be a better developer
        </span>
      </div>
    </Link>
  );
};
