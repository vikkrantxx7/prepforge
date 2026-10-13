'use client';

import { createContext } from 'react';

export type User = {
  email: string;
  role: string;
};
type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
