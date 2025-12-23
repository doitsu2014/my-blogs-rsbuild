import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authenticated, loading, login } = useAuth();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    // Check if we're in the middle of processing an OAuth callback
    // (URL has state, code, or session_state parameters in hash)
    const hash = window.location.hash;
    const isProcessingCallback = hash && (
      hash.includes('state=') || 
      hash.includes('code=') || 
      hash.includes('session_state=')
    );

    if (isProcessingCallback) {
      // Don't trigger login again, Keycloak is processing the callback
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4 text-gray-600">Completing authentication...</p>
          </div>
        </div>
      );
    }

    // Only redirect to login if we're not already redirecting
    if (!isRedirecting) {
      setIsRedirecting(true);
      // Use setTimeout to avoid calling login during render
      setTimeout(() => {
        login();
      }, 0);
    }

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
