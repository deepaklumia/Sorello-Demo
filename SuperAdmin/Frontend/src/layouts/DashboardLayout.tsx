import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Utensils,
  ShoppingCart,
  BarChart2,
  Settings,
  LogOut,
  Search,
  Server,
  Bell,
  Sliders,
} from 'lucide-react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Restaurants', path: '/restaurants', icon: Utensils },
    { label: 'Orders', path: '/orders', icon: ShoppingCart },
    { label: 'Analytics', path: '/analytics', icon: BarChart2 },
    { label: 'Platform Settings', path: '/settings', icon: Settings },
  ];

  const currentPath = location.pathname;

  const getBreadcrumbTitle = () => {
    if (currentPath === '/dashboard') return 'Dashboard';
    if (currentPath === '/restaurants') return 'Restaurants';
    if (currentPath === '/orders') return 'Orders';
    if (currentPath === '/analytics') return 'Analytics';
    if (currentPath === '/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-space-dark text-white overflow-hidden">
      {/* 1. Left Sidebar */}
      <aside className="w-[260px] bg-space-dark border-r border-space-border flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Logo Brand */}
          <div className="h-[80px] px-6 border-b border-space-border/50 flex items-center gap-3">
            <img src="/logo.png" alt="Sorello Logo" className="w-8 h-8 object-contain" />
            <div>
              <h1 className="text-sm font-bold font-heading text-white tracking-tight">Sorello POS</h1>
              <p className="text-[10px] text-space-muted font-bold tracking-wider">Enterprise Admin</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-space-surface border-l-[3px] border-accent-cyan text-accent-cyan shadow-[0_0_12px_rgba(0,240,255,0.05)]'
                      : 'text-space-muted hover:text-white hover:bg-space-surface/40'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-accent-cyan' : 'text-space-muted'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card Widget */}
        <div className="p-4 border-t border-space-border/50 bg-space-surface/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-accent-purple/20 border border-accent-purple/35 flex items-center justify-center font-bold text-accent-purple text-xs shrink-0 uppercase">
              {user?.name?.slice(0, 2) || 'AD'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-none">{user?.name || 'Admin User'}</p>
              <span className="text-[9px] font-bold text-accent-cyan tracking-widest uppercase">
                {user?.role?.replace('_', ' ') || 'SUPER ADMIN'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-space-muted hover:text-rose-400 transition-colors p-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. Main Page Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-[80px] bg-space-dark/85 backdrop-blur-md border-b border-space-border flex items-center justify-between px-8 z-10 shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-space-muted font-semibold font-sans">
            <span>Admin</span>
            <span>&gt;</span>
            <span className="text-white">{getBreadcrumbTitle()}</span>
          </div>

          {/* Search bar */}
          <div className="relative w-[360px]">
            <Search className="w-4 h-4 text-space-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search systems, logs, or entities..."
              className="w-full bg-space-surface border border-space-border/80 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder-space-muted focus:border-accent-cyan/60 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Utility Tools & Avatar */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 border-r border-space-border pr-5">
              <button className="text-space-muted hover:text-white transition-colors" title="Server Status">
                <Server className="w-4 h-4 text-accent-cyan animate-pulse" />
              </button>
              <button className="text-space-muted hover:text-white transition-colors relative" title="Notifications">
                <Bell className="w-4 h-4" />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
              </button>
              <button className="text-space-muted hover:text-white transition-colors" title="System Settings">
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Avatar indicator */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-white leading-none">{user?.name || 'Deepak Kumar'}</p>
                <span className="text-[9px] font-bold text-accent-cyan tracking-wider uppercase">
                  SYSTEM ROOT
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center font-bold text-accent-cyan text-xs shrink-0 uppercase">
                {user?.name?.slice(0, 1) || 'D'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
};
