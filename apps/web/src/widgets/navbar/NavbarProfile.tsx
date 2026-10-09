'use client';

import { LogOut, User } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/shared/lib/hooks/useAuth';
import { Button, buttonVariants } from '@/shared/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/Sheet';

export const NavbarProfile = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = user?.email.slice(0, 2).toUpperCase();

  return (
    <>
      {user ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
          aria-label="Open profile menu"
        >
          {initials}
        </button>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          Sign in
        </Button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{user ? user.email : 'Welcome'}</SheetTitle>
          </SheetHeader>

          {user ? (
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href={'/profile' as Route}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={'/login' as Route}
                onClick={() => setOpen(false)}
                className={buttonVariants()}
              >
                Log in
              </Link>
              <Link
                href={'/register' as Route}
                onClick={() => setOpen(false)}
                className={buttonVariants({ variant: 'outline' })}
              >
                Sign up
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
