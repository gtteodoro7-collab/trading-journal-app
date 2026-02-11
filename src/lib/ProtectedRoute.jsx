import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) return null; // or a loader

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // App shows Login when not authenticated
  }

  return <>{children}</>;
}
