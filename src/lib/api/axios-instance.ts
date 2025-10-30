import axios from 'axios';

const normalizeUrl = (rawUrl: string): string => {
  const trimmed = rawUrl.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `${trimmed.includes('localhost') || trimmed.startsWith('127.') ? 'http' : 'https'}://${trimmed}`;
  return withProtocol.replace(/\/$/, '');
};

export const basePath = '/api';

const resolveBaseURL = (): string | undefined => {
  const explicitUrl = process.env.NEXT_PUBLIC_API_URL;
  if (explicitUrl && explicitUrl.trim().length > 0) {
    return normalizeUrl(explicitUrl);
  }

  if (typeof window !== 'undefined') {
    return undefined;
  }

  const inferredHost =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || process.env.VERCEL_URL;

  if (inferredHost && inferredHost.trim().length > 0) {
    return normalizeUrl(inferredHost);
  }

  return 'http://localhost:3000';
};

const instance = axios.create({
  baseURL: resolveBaseURL(),
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  // Add auth headers or logging here
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.log('There was an error', error);
    return Promise.reject(error);
  }
);

export default instance;
