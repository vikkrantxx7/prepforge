'use client';

import { LogOut, User } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { useAuth } from '@/shared/lib/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/shared/ui/Sheet';

type AuthMode = 'login' | 'register';

const getSubmitLabel = (isLoading: boolean, mode: AuthMode) => {
  if (isLoading) {
    return 'Please wait...';
  }

  if (mode === 'login') {
    return 'Log in';
  }

  return 'Create account';
};

const validateAuthInput = ({
  mode,
  email,
  password,
  confirmPassword,
}: {
  mode: AuthMode;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  if (!email || !password) {
    return 'Email and password are required.';
  }

  if (!email.includes('@')) {
    return 'Please enter a valid email address.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  if (mode === 'register' && password !== confirmPassword) {
    return 'Passwords do not match.';
  }

  return null;
};

export const NavbarProfile = () => {
  const { user, logout, login, register, isLoading, error, clearError } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const prevUserRef = useRef(user);

  const initials = user?.email.slice(0, 2).toUpperCase();
  const currentError = formError ?? error;
  const submitLabel = getSubmitLabel(isLoading, mode);

  useEffect(() => {
    const hadNoUser = !prevUserRef.current;
    const hasUserNow = !!user;

    if (hadNoUser && hasUserNow && open) {
      setOpen(false);
    }

    prevUserRef.current = user;
  }, [open, user]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFormError(null);
    clearError();
  };

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    setFormError(null);
    clearError();
  };

  const submitAuth = async () => {
    const validationError = validateAuthInput({
      mode,
      email,
      password,
      confirmPassword,
    });

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    clearError();

    if (mode === 'login') {
      await login(email, password);
      return;
    }

    await register(email, password);
  };

  const handleSubmit: React.ComponentProps<'form'>['onSubmit'] = (event) => {
    event.preventDefault();
    void submitAuth();
  };

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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            resetForm();
            setMode('login');
            setOpen(true);
          }}
        >
          Sign in
        </Button>
      )}

      {open ? (
        <Sheet
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) {
              resetForm();
            }
          }}
        >
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
              <form className="mt-6 flex flex-col gap-3 px-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 rounded-md border border-border p-1">
                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
                    className={
                      mode === 'login'
                        ? 'rounded-sm bg-muted px-3 py-1.5 text-sm font-medium text-foreground'
                        : 'rounded-sm px-3 py-1.5 text-sm text-muted-foreground'
                    }
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('register')}
                    className={
                      mode === 'register'
                        ? 'rounded-sm bg-muted px-3 py-1.5 text-sm font-medium text-foreground'
                        : 'rounded-sm px-3 py-1.5 text-sm text-muted-foreground'
                    }
                  >
                    Sign up
                  </button>
                </div>

                <label htmlFor={emailId} className="text-xs text-muted-foreground">
                  Email
                </label>
                <input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />

                <label htmlFor={passwordId} className="text-xs text-muted-foreground">
                  Password
                </label>
                <input
                  id={passwordId}
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring"
                  placeholder="At least 6 characters"
                  disabled={isLoading}
                />

                {mode === 'register' && (
                  <>
                    <label htmlFor={confirmPasswordId} className="text-xs text-muted-foreground">
                      Confirm password
                    </label>
                    <input
                      id={confirmPasswordId}
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring"
                      placeholder="Re-enter password"
                      disabled={isLoading}
                    />
                  </>
                )}

                {!!currentError && (
                  <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {currentError}
                  </p>
                )}

                <Button type="submit" disabled={isLoading}>
                  {submitLabel}
                </Button>
              </form>
            )}
          </SheetContent>
        </Sheet>
      ) : null}
    </>
  );
};
