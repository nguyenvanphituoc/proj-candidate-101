import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { apiHttpClient } from '@core/network';
import { queryClient } from '@core/query/queryClient';
import {
  login,
  logout,
  registerAuthInterceptors,
  restoreSession,
} from '@/modules/auth';
import type { AuthSession } from '@/modules/auth';

/**
 * Session state at app level (TECH_SPEC §2.4) — presence of a session decides
 * which navigator stack renders. Tokens stay inside the session object and
 * are never logged.
 */
export interface AuthSessionContextType {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: () => boolean;
  status: 'rehydrated' | 'rehydrating';
  /** Display name of the signed-in user; empty when signed out. */
  userName: string;
}

export const AuthSessionContext = React.createContext<AuthSessionContextType>({
  signIn: async (_username: string, _password: string) => {},
  signOut: () => {},
  isAuthenticated: () => false,
  status: 'rehydrating',
  userName: '',
});

export const AuthSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [status, setStatus] = useState<'rehydrating' | 'rehydrated'>(
    'rehydrating',
  );
  const [session, setSession] = useState<AuthSession | null>(null);
  // the header interceptor reads the session synchronously, outside React
  const sessionRef = useRef<AuthSession | null>(null);

  const applySession = useCallback((next: AuthSession | null) => {
    sessionRef.current = next;
    setSession(next);
  }, []);

  // UC-03: cold-start restore — local expiry check only, no network call.
  useEffect(() => {
    let cancelled = false;
    restoreSession()
      .then(restored => {
        if (!cancelled) applySession(restored);
      })
      .catch(() => {
        // unreadable storage = no session; land on login
      })
      .finally(() => {
        if (!cancelled) setStatus('rehydrated');
      });
    return () => {
      cancelled = true;
    };
  }, [applySession]);

  // UC-01: rejection propagates to the login screen; nothing is stored.
  const signIn = useCallback(
    async (username: string, password: string) => {
      const next = await login(username, password);
      applySession(next);
    },
    [applySession],
  );

  // UC-04: local-only clear (works offline) + wipe all cached server data.
  const signOut = useCallback(() => {
    applySession(null);
    queryClient.clear();
    logout().catch(() => {});
  }, [applySession]);

  // Composition-time registration (TECH_SPEC §2.2): Bearer + org-token headers
  // on the shared api client, and 401 → forced logout + session wipe (§2.5).
  useEffect(
    () =>
      registerAuthInterceptors(apiHttpClient, {
        getSession: () => sessionRef.current,
        onUnauthorized: signOut,
      }),
    [signOut],
  );

  const isAuthenticated = useCallback(() => session !== null, [session]);

  const userName = session?.userName ?? '';

  const value = useMemo(
    () => ({ signIn, signOut, isAuthenticated, status, userName }),
    [signIn, signOut, isAuthenticated, status, userName],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSession = () => React.useContext(AuthSessionContext);
