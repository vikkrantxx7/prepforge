'use client';

import { HTTPError } from 'ky';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '@/shared/lib/api/authApi';
import { AuthContext, type User } from '@/shared/lib/authContext';
import { clearAuthToken, getAuthToken, setAuthToken } from '@/shared/lib/storage/authToken';

const getErrorMessage = async (error: unknown) => {
  if (error instanceof HTTPError) {
    try {
      const response = await error.response.json<{ error?: string }>();
      return response.error ?? 'Request failed';
    } catch {
      return 'Request failed';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    clearAuthToken();
  }, []);

  const refreshMe = useCallback(async () => {
    const activeToken = token ?? getAuthToken();

    if (!activeToken) {
      setUser(null);
      return;
    }

    try {
      const profile = await authApi.me(activeToken);
      setUser(profile);
      setToken(activeToken);
      setError(null);
    } catch (requestError) {
      logout();
      setError(await getErrorMessage(requestError));
    }
  }, [logout, token]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.login({ email, password });
        setAuthToken(response.token);
        setToken(response.token);

        const profile = await authApi.me(response.token);
        setUser(profile);
      } catch (requestError) {
        logout();
        setError(await getErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    },
    [logout],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await authApi.register({ email, password });
        await login(email, password);
      } catch (requestError) {
        setError(await getErrorMessage(requestError));
        setIsLoading(false);
      }
    },
    [login],
  );

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = getAuthToken();

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      setToken(storedToken);
      await refreshMe();
      setIsLoading(false);
    };

    void bootstrap();
  }, [refreshMe]);

  const value = useMemo(
    () => ({ user, token, isLoading, error, login, logout, register, refreshMe, clearError }),
    [clearError, error, isLoading, login, logout, refreshMe, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
