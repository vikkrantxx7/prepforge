'use client';

import { Bell, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '@/shared/lib/hooks/useTheme';
import { Button } from '@/shared/ui/Button';

export const NavbarActions = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" aria-label="Search">
        <Search className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-5 w-5" />
      </Button>
    </div>
  );
};
