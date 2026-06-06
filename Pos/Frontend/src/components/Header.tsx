import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-16 lg:h-[76px] bg-white border-b border-space-border flex justify-between items-center px-4 lg:px-8 shrink-0 select-none">
      {/* Title & Mobile Logo */}
      <div className="flex items-center gap-2.5">
        <img 
          src="/logo.png" 
          alt="Sorello Logo" 
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain lg:hidden" 
        />
        <h2 className="text-lg lg:text-xl font-extrabold font-heading text-gray-900 tracking-tight">
          {title}
        </h2>
      </div>

      {/* Action Tray */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-space-border flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-950 hover:bg-gray-50 transition-all relative"
        >
          <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full absolute top-2 lg:top-2.5 right-2 lg:right-2.5 animate-pulse"></span>
        </motion.button>
      </div>
    </header>
  );
};
export default Header;
