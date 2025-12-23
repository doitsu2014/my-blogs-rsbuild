import React, { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Module-level flag to prevent multiple simultaneous login redirects
let isLoginInProgress = false;

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authenticated, loading, login } = useAuth();

  // Effect to trigger login only once when needed
  useEffect(() => {
    // Check if we're in the middle of processing an OAuth callback
    const hash = window.location.hash;
    const isProcessingCallback = hash && (
      hash.includes('state=') || 
      hash.includes('code=') || 
      hash.includes('session_state=')
    );

    // If not authenticated and not processing callback and login not already triggered
    if (!authenticated && !loading && !isProcessingCallback && !isLoginInProgress) {
      isLoginInProgress = true;
      // Trigger login redirect
      login();
    }
  }, [authenticated, loading, login]);

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

    // Show redirecting message while login is being triggered
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Reset the login flag when successfully authenticated
  if (authenticated) {
    isLoginInProgress = false;
  }

  return <>{children}</>;
};
