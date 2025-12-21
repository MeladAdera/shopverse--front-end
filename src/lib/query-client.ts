// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 دقيقة
      gcTime: 5 * 60 * 1000, // 5 دقائق
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});