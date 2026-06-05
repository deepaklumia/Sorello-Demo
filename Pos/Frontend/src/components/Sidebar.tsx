import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Utensils, History, Settings, Shield } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { label: 'Order', path: '/orders', icon: ShoppingCart },
    { label: 'Menu', path: '/menu', icon: Utensils },
    { label: 'History', path: '/history', icon: History },
    { label: 'Setting', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-[260px] bg-white border-r border-space-border flex flex-col justify-between shrink-0 h-screen">
      {/* Brand Header */}
      <div className="p-6 text-left flex items-center gap-3">
        <img src="/logo.png" alt="Sorello Logo" className="w-9 h-9 object-contain" />
        <div>
          <h1 className="text-lg font-extrabold font-heading text-gray-900 tracking-tight">
            Sorella POS
          </h1>
          <p className="text-[11px] text-space-muted font-bold tracking-wider uppercase">
            Terminal #01
          </p>
        </div>
      </div>

      {/* Navigation Stack */}
      <nav className="flex-1 px-4 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-bold tracking-tight transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Admin Button Footer */}
      <div className="p-4 border-t border-space-border">
        <button 
          onClick={() => alert('Access locked. Enter manager terminal key.')}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-space-border hover:border-gray-900 hover:bg-gray-50 text-xs font-bold text-gray-600 hover:text-gray-900 transition-all uppercase tracking-wider"
        >
          <Shield className="w-4 h-4 text-gray-400" />
          Admin Mode
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
