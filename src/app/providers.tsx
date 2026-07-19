import React, { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
        <AuthSessionProvider>{children}</AuthSessionProvider>
    </SafeAreaProvider>
  );
}
