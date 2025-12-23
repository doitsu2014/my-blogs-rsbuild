import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import keycloak from './keycloak';
import type Keycloak from 'keycloak-js';

interface AuthContextType {
  keycloak: Keycloak | null;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<AuthContextType['userInfo']>(null);

  useEffect(() => {
    // Initialize Keycloak with PKCE and custom scope
    const scope = import.meta.env.PUBLIC_KEYCLOAK_SCOPE || 'my-headless-cms-api-all email openid profile';
    
    keycloak
      .init({
        onLoad: 'check-sso', // Check SSO silently
        pkceMethod: 'S256', // Use PKCE with SHA-256
        checkLoginIframe: false, // Disable iframe for better performance
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        scope: scope, // Include custom CMS API scope
        // Enable redirect mode for better handling of OAuth callbacks
        flow: 'standard',
        // Clean up URL after successful authentication
        enableLogging: false,
      })
      .then((auth) => {
        setAuthenticated(auth);
        setLoading(false);

        if (auth && keycloak.token) {
          setToken(keycloak.token);

          // Clean up URL hash after successful authentication
          if (window.location.hash) {
            // Use history API to remove hash without triggering navigation
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }

          // Load user info
          keycloak.loadUserInfo().then((userInfoData: any) => {
            setUserInfo({
              name: userInfoData.name,
              email: userInfoData.email,
              username: userInfoData.preferred_username,
            });
          });

          // Setup token refresh
          setInterval(() => {
            keycloak.updateToken(70).then((refreshed) => {
              if (refreshed && keycloak.token) {
                setToken(keycloak.token);
                console.log('Token refreshed');
              }
            }).catch(() => {
              console.error('Failed to refresh token');
              keycloak.logout();
            });
          }, 60000); // Check every minute
        }
      })
      .catch((error) => {
        console.error('Keycloak initialization failed:', error);
        setLoading(false);
      });
  }, []);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  const value: AuthContextType = {
    keycloak,
    authenticated,
    loading,
    token,
    userInfo,
    login,
    logout,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
