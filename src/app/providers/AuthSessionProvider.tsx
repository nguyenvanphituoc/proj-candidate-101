import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { queryClient } from '@core/query/queryClient';
import { login, logout, restoreSession } from '@/modules/auth';
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
}

export const AuthSessionContext = React.createContext<AuthSessionContextType>({
  signIn: async (_username: string, _password: string) => {},
  signOut: () => {},
  isAuthenticated: () => false,
  status: 'rehydrating',
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

  // UC-03: cold-start restore — local expiry check only, no network call.
  useEffect(() => {
    let cancelled = false;
    restoreSession()
      .then(restored => {
        if (!cancelled) setSession(restored);
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
  }, []);

  // UC-01: rejection propagates to the login screen; nothing is stored.
  const signIn = useCallback(async (username: string, password: string) => {
    const next = await login(username, password);
    setSession(next);
  }, []);

  // UC-04: local-only clear (works offline) + wipe all cached server data.
  const signOut = useCallback(() => {
    setSession(null);
    queryClient.clear();
    logout().catch(() => {});
  }, []);

  const isAuthenticated = useCallback(() => session !== null, [session]);

  const value = useMemo(
    () => ({ signIn, signOut, isAuthenticated, status }),
    [signIn, signOut, isAuthenticated, status],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSession = () => React.useContext(AuthSessionContext);
