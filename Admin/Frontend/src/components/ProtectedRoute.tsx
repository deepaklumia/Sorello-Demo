import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, restaurant } = useAuth();
  const { slug } = useParams<{ slug: string }>();

  const activeSlug = slug || restaurant?.slug || 'burger-palace';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-space-border border-t-accent-cyan animate-spin"></div>
          <p className="text-xs text-space-muted font-bold tracking-widest uppercase mt-4">
            Loading Session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/${activeSlug}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
