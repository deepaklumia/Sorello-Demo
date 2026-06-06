import React from 'react';
import { Routes, Route, Navigate, useLocation, NavLink } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import OrdersPage from './pages/OrdersPage';
import MenuPage from './pages/MenuPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/authStore';
import { ShoppingCart, Utensils, History as HistoryIcon, Settings } from 'lucide-react';

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

  const mobileNavItems = [
    { label: 'Orders', path: '/orders', icon: ShoppingCart },
    { label: 'Menu', path: '/menu', icon: Utensils },
    { label: 'History', path: '/history', icon: HistoryIcon },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F5FD]">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Page Viewport */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden pb-16 lg:pb-0">
        <Routes>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/orders" replace />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="flex lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-space-border justify-around items-center z-30 px-2 shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 w-16 h-full text-[10px] font-extrabold tracking-tight transition-colors duration-150 ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
export default App;

