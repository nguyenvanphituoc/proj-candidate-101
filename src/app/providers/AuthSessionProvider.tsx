import React, { useState } from 'react';

let is_auth: boolean = false;

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
    'rehydrated',
  );
  const [session, setSession] = useState<any>(is_auth);

  const signIn = async (_username: string, _password: string) => {
    // Simulate an API call for authentication
    setSession(true);
  };

  const signOut = () => {
    setSession(false);
  };

  const isAuthenticated = () => {
    return session;
  };

  return (
    <AuthSessionContext.Provider
      value={{ signIn, signOut, isAuthenticated, status }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSession = () => React.useContext(AuthSessionContext);
