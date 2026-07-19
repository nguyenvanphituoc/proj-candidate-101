import { QueryClient } from '@tanstack/react-query';

/**
 * Single QueryClient for the app (TECH_SPEC §2.4 — server state).
 * Kept in core so logout can clear the whole cache without knowing any keys.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});
