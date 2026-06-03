import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import OpeningHours from './pages/OpeningHours';
import OrderHistory from './pages/OrderHistory';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

const LayoutWrapper: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="hours" element={<OpeningHours />} />
        <Route path="orders" element={<OrderHistory />} />
        <Route path="settings" element={<Settings />} />
        {/* Fallback inside slug path to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Login Gateway */}
      <Route path="/:slug" element={<Login />} />
      
      {/* Nested Protected routes */}
      <Route 
        path="/:slug/*" 
        element={
          <ProtectedRoute>
            <LayoutWrapper />
          </ProtectedRoute>
        } 
      />

      {/* Root redirect fallback to default tenant */}
      <Route path="*" element={<Navigate to="/burger-palace" replace />} />
    </Routes>
  );
};

export default App;
