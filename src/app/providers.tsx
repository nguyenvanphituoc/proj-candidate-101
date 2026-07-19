import React, { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@core/query/queryClient';
import { AuthSessionProvider } from './providers/AuthSessionProvider';

/**
 * Provider stack, outermost first:
 *   SafeAreaProvider  → insets consumed once inside core's Screen primitive
 *   QueryClientProvider → server state (TECH_SPEC §2.4)
 *   AuthSessionProvider → session state + http interceptors
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
