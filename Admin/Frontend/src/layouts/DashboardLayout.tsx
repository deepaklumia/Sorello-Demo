import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Utensils,
  Clock,
  History,
  Settings,
  LogOut,
  Search,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { restaurant, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const slug = restaurant?.slug || 'burger-palace';

  const menuItems = [
    { label: 'Dashboard', path: `/${slug}/dashboard`, icon: LayoutDashboard },
    { label: 'Menu Management', path: `/${slug}/menu`, icon: Utensils },
    { label: 'Opening Hours', path: `/${slug}/hours`, icon: Clock },
    { label: 'Order History', path: `/${slug}/orders`, icon: History },
    { label: 'Settings', path: `/${slug}/settings`, icon: Settings },
  ];

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex">
      {/* 1. Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-[#0C101B] border-r border-space-border/60 shrink-0 sticky top-0 h-screen z-20">
        {/* Header Logo */}
        <div className="h-[76px] flex flex-col justify-center px-6 border-b border-space-border/30">
          <h1 className="text-base font-extrabold font-heading text-white tracking-wide truncate">
            {restaurant?.name || 'Restaurant'}
          </h1>
          <p className="text-[9px] text-space-muted font-bold tracking-widest uppercase mt-0.5">
            Admin Console
          </p>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#151B2C] text-accent-cyan border-l-[3px] border-accent-cyan shadow-[0_0_15px_rgba(0,240,255,0.05)]'
                    : 'text-space-muted hover:text-white hover:bg-space-surface/20'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-accent-cyan' : 'text-space-muted'}`} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Profile Footer Widget */}
        <div className="p-4 border-t border-space-border/50 bg-[#0E1322]/40 flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple flex items-center justify-center font-bold text-white shadow-inner text-xs shrink-0">
              {restaurant?.name?.slice(0, 2).toUpperCase() || 'OP'}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-extrabold text-white truncate">Admin User</p>
              <p className="text-[10px] text-space-muted font-semibold truncate">Shift Manager</p>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="p-2 hover:bg-space-surface rounded-lg text-space-muted hover:text-rose-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="h-[76px] bg-[#0B0F19] border-b border-space-border/40 flex justify-between items-center px-4 md:px-8 sticky top-0 z-10">
          {/* Mobile menu toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-space-surface rounded-lg text-space-muted hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-white truncate max-w-[150px]">
              {restaurant?.name || 'Console'}
            </h1>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center relative w-full max-w-[400px]">
            <Search className="w-4 h-4 text-space-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders, menus, or analytics..."
              className="w-full bg-[#151B2C]/50 border border-space-border/60 rounded-full py-2 pl-11 pr-4 text-xs text-white placeholder-space-muted focus:border-accent-cyan focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Right Action tray */}
          <div className="flex items-center gap-4">
            {/* Live status dot */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              Live Status
            </div>

            {/* Notification bell */}
            <button className="p-2 hover:bg-space-surface rounded-full text-space-muted hover:text-white transition-all relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full absolute top-1.5 right-1.5"></span>
            </button>

            {/* User profile dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 rounded-full bg-space-surface border border-space-border/80 flex items-center justify-center text-space-muted hover:text-white hover:border-accent-cyan transition-colors"
              >
                <User className="w-4.5 h-4.5" />
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowProfileMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-space-surface border border-space-border rounded-lg shadow-xl py-1 z-30 text-xs">
                    <div className="px-4 py-2 border-b border-space-border/50">
                      <p className="font-bold text-white truncate">{restaurant?.name}</p>
                      <p className="text-[10px] text-space-muted truncate">{restaurant?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate(`/${slug}/settings`);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-space-dark text-white hover:text-accent-cyan transition-colors"
                    >
                      Restaurant Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogoutClick();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-space-dark text-rose-400 transition-colors border-t border-space-border/30"
                    >
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 3. Sidebar - Mobile Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-space-dark/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-[#0C101B] border-r border-space-border/60 flex flex-col z-40 lg:hidden animate-slide-right">
            <div className="h-[76px] flex justify-between items-center px-6 border-b border-space-border/30">
              <div>
                <h1 className="text-sm font-extrabold text-white truncate max-w-[150px]">
                  {restaurant?.name || 'Restaurant'}
                </h1>
                <p className="text-[8px] text-space-muted font-bold tracking-widest uppercase mt-0.5">
                  Admin Console
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-space-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#151B2C] text-accent-cyan border-l-[3px] border-accent-cyan shadow-[0_0_15px_rgba(0,240,255,0.05)]'
                        : 'text-space-muted hover:text-white hover:bg-space-surface/20'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-space-border/50 bg-[#0E1322]/40 flex justify-between items-center gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple flex items-center justify-center font-bold text-white text-xs shrink-0">
                  {restaurant?.name?.slice(0, 2).toUpperCase() || 'OP'}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-extrabold text-white truncate">Admin User</p>
                  <p className="text-[10px] text-space-muted font-semibold truncate">Shift Manager</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogoutClick();
                }}
                className="p-2 hover:bg-space-surface rounded-lg text-space-muted hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};
export default DashboardLayout;
