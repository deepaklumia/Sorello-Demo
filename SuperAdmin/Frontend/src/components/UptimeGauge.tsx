import React from 'react';

interface UptimeGaugeProps {
  percentage?: number;
  subtext?: string;
}

export const UptimeGauge: React.FC<UptimeGaugeProps> = ({
  percentage = 82,
  subtext = 'Global Terminal Uptime Across 12 Countries',
}) => {
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-between h-[280px] text-center">
      <span className="text-[10px] uppercase tracking-wider text-space-muted font-bold self-start">
        Terminal Health
      </span>

      {/* SVG Radial Gauge */}
      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#9D00FF" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="transparent"
            stroke="#2C3A5A"
            strokeWidth={strokeWidth}
            strokeOpacity="0.25"
          />

          {/* Progress circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            fill="transparent"
            stroke="url(#gaugeGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white font-heading tracking-tight">
            {percentage}%
          </span>
          <span className="text-[8px] font-bold text-accent-cyan uppercase tracking-widest mt-0.5">
            ONLINE
          </span>
        </div>
      </div>

      <p className="text-xs text-space-muted font-medium max-w-[200px] leading-relaxed">
        {subtext}
      </p>
    </div>
  );
};
