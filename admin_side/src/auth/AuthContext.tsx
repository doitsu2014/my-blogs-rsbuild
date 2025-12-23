import React, { ReactNode } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  token: string | null;
  userInfo: {
    name?: string;
    email?: string;
    username?: string;
  } | null;
  login: () => void;
  logout: () => void;
  status: 'authenticated' | 'unauthenticated' | 'loading';
}

interface AuthProviderProps {
  children: ReactNode;
}

// Inner component that uses useSession
const AuthContextProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};

export const useAuth = (): AuthContextType => {
  const { data: session, status } = useSession();
  
  const authenticated = status === 'authenticated';
  const loading = status === 'loading';
  const token = (session as any)?.accessToken || null;
  
  const userInfo = session?.user
    ? {
        name: session.user.name || undefined,
        email: session.user.email || undefined,
        username: (session.user as any).username || undefined,
      }
    : null;

  const login = () => {
    signIn('keycloak');
  };

  const logout = () => {
    signOut({ callbackUrl: window.location.origin });
  };

  return {
    authenticated,
    loading,
    token,
    userInfo,
    login,
    logout,
    status,
  };
};
