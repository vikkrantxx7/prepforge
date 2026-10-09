'use client';

import { createContext } from 'react';

export type User = {
  email: string;
  role: string;
};
type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
