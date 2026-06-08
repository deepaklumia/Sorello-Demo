import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Restaurants } from './pages/Restaurants';
import { Orders } from './pages/Orders';
import { DashboardLayout } from './layouts/DashboardLayout';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-accent-cyan text-xs font-bold uppercase tracking-wider">
        Initializing terminal auth...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurants"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Restaurants />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Orders />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="glass-card rounded-xl p-8 text-center max-w-md mx-auto my-20 space-y-4">
                <h3 className="text-lg font-bold font-heading text-white">Revenue & System Analytics</h3>
                <p className="text-xs text-space-muted leading-relaxed">
                  Real-time aggregation engines are active. Live metrics, chart trends, and regional terminal uptime nodes are plotted on the main Dashboard.
                </p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="glass-card rounded-xl p-8 text-center max-w-md mx-auto my-20 space-y-4">
                <h3 className="text-lg font-bold font-heading text-white">Platform Settings</h3>
                <p className="text-xs text-space-muted leading-relaxed">
                  SaaS POS Platform clusters are locked. Credentials, API endpoints, and security configurations are configured automatically through local environment files.
                </p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback routing */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
