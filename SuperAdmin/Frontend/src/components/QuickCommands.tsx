import React from 'react';
import { Store, HelpCircle, Terminal, Database } from 'lucide-react';

interface QuickCommandsProps {
  onAddRestaurant?: () => void;
}

export const QuickCommands: React.FC<QuickCommandsProps> = ({ onAddRestaurant }) => {
  const commands = [
    { label: 'Add Merchant', icon: Store, color: 'text-accent-cyan hover:border-accent-cyan/40', action: onAddRestaurant },
    { label: 'Support Hub', icon: HelpCircle, color: 'text-accent-purple hover:border-accent-purple/40', action: () => alert('Support Hub opened') },
    { label: 'Node Console', icon: Terminal, color: 'text-amber-400 hover:border-amber-400/40', action: () => alert('Console session initialized') },
    { label: 'DB Manager', icon: Database, color: 'text-emerald-400 hover:border-emerald-400/40', action: () => alert('Database inspector launched') },
  ];

  return (
    <div className="glass-card rounded-xl p-5 h-[280px] flex flex-col justify-between text-left">
      <span className="text-[10px] uppercase tracking-wider text-space-muted font-bold self-start">
        QUICK COMMAND
      </span>

      <div className="grid grid-cols-2 gap-3.5 my-2 flex-1 items-center">
        {commands.map((cmd, i) => {
          const Icon = cmd.icon;
          return (
            <button
              key={i}
              onClick={cmd.action}
              className={`flex flex-col items-center justify-center p-3.5 bg-space-dark/45 border border-space-border/50 rounded-lg hover:bg-space-dark transition-all duration-200 group text-center h-[76px] ${cmd.color}`}
            >
              <Icon className="w-5 h-5 mb-1.5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wide group-hover:text-white/90">
                {cmd.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
