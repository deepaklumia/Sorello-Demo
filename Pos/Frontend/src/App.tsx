import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OrdersPage from './pages/OrdersPage';
import MenuPage from './pages/MenuPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/authStore';

export const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // If not logged in and not on login page, redirect to /login
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // If logged in and on login page, redirect to dashboard /orders
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/orders" replace />;
  }

  // Isolated route layout for login page (no sidebar)
  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F5FD]">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Page Viewport */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Routes>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/orders" replace />} />
        </Routes>
      </main>
    </div>
  );
};
export default App;

