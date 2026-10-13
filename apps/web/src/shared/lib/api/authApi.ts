import { apiClient } from '@/shared/config/ky';
import type { User } from '@/shared/lib/authContext';

type AuthCredentials = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export const authApi = {
  login: (credentials: AuthCredentials) => {
    return apiClient.post('auth/login', { json: credentials }).json<LoginResponse>();
  },

  register: (credentials: AuthCredentials) => {
    return apiClient.post('auth/register', { json: credentials }).json<User>();
  },

  me: (token: string) => {
    return apiClient
      .get('auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .json<User>();
  },
};
