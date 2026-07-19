import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SystemBars } from 'react-native-edge-to-edge';
import { RootModal, RootModalProvider, Spinner } from '@core/ui';
import { AppProviders } from './providers';
import { useAuthSession } from './providers/AuthSessionProvider';
import { AuthStack } from './(auth)/_layout';
import { MainStack } from './(main)/_layout';

/**
 * Root navigator switches whole stacks on session presence (TECH_SPEC §2.4):
 *   restoring       → splash spinner while keychain is read
 *   authenticated   → (main) stack
 *   unauthenticated → (auth) stack
 */
function RootNavigator() {
  const { status, isAuthenticated } = useAuthSession();

  if (status === 'rehydrating') {
    return <Spinner fill />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated() ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export function AppRoot() {
  return (
    <AppProviders>
      <SystemBars style="auto" />
      <RootModalProvider>
        <RootNavigator />
        {/* Last child on purpose — absolute overlay stacks above every screen */}
        <RootModal />
      </RootModalProvider>
    </AppProviders>
  );
}

export default AppRoot;
