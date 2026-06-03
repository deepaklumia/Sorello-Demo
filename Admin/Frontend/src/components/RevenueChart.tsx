import React from 'react';

export const RevenueChart: React.FC = () => {
  return (
    <div className="w-full">
      {/* SVG Canvas */}
      <div className="relative h-[180px] w-full mt-4">
        <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            {/* Glow Filter */}
            <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient Fill under line */}
            <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid helper lines (horizontal) */}
          <line x1="0" y1="50" x2="800" y2="50" stroke="#2C3A5A" strokeOpacity="0.15" strokeDasharray="5,5" />
          <line x1="0" y1="100" x2="800" y2="100" stroke="#2C3A5A" strokeOpacity="0.15" strokeDasharray="5,5" />
          <line x1="0" y1="150" x2="800" y2="150" stroke="#2C3A5A" strokeOpacity="0.15" strokeDasharray="5,5" />

          {/* Area Fill */}
          <path
            d="M 0 160 Q 120 70, 240 120 T 480 150 T 720 40 L 800 40 L 800 200 L 0 200 Z"
            fill="url(#area-gradient)"
          />

          {/* Glowing Line */}
          <path
            d="M 0 160 Q 120 70, 240 120 T 480 150 T 720 40 L 800 40"
            fill="none"
            stroke="#00F0FF"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#cyan-glow)"
          />

          {/* Pulse node at Peak */}
          <circle cx="720" cy="40" r="6" fill="#00F0FF" />
          <circle cx="720" cy="40" r="12" fill="none" stroke="#00F0FF" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: '720px 40px' }} />
        </svg>
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between text-[10px] text-space-muted font-bold tracking-wider mt-4 px-2 select-none">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>

      {/* Stats row underneath */}
      <div className="flex gap-10 mt-6 pt-4 border-t border-space-border/20 text-left">
        <div>
          <p className="text-[9px] uppercase tracking-wider text-space-muted font-extrabold">Avg Daily Revenue</p>
          <p className="text-base font-extrabold text-white mt-0.5">$1,714</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-wider text-space-muted font-extrabold">Peak Day</p>
          <p className="text-base font-extrabold text-emerald-400 mt-0.5">Friday</p>
        </div>
      </div>
    </div>
  );
};
export default RevenueChart;
