import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-[76px] bg-white border-b border-space-border flex justify-between items-center px-8 shrink-0 select-none">
      {/* Title */}
      <h2 className="text-xl font-extrabold font-heading text-gray-900 tracking-tight">
        {title}
      </h2>

      {/* Action Tray */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full border border-space-border flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-950 hover:bg-gray-50 transition-all relative"
        >
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 bg-red-500 rounded-full absolute top-2.5 right-2.5 animate-pulse"></span>
        </motion.button>
      </div>
    </header>
  );
};
export default Header;
