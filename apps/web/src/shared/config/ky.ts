import ky from 'ky';
import { API_V1_URL } from '@/shared/config/api';

export const apiClient = ky.create({
  prefix: API_V1_URL,
  timeout: 10_000,
});
