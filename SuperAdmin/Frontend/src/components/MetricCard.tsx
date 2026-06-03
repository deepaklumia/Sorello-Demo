import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  status?: {
    text: string;
    type: 'live' | 'record' | 'success' | 'none';
  };
  subtext?: string;
  progress?: number;
  avatars?: string[];
  icon?: React.ReactNode;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  status,
  subtext,
  progress,
  avatars,
  icon,
  actionIcon,
  onAction,
}) => {
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col justify-between h-44 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-accent-cyan/30">
      {/* Top row */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 bg-space-dark border border-space-border rounded-lg text-accent-cyan flex items-center justify-center">
              {icon}
            </div>
          )}
          <span className="text-[10px] uppercase tracking-wider text-space-muted font-bold font-sans">
            {title}
          </span>
        </div>

        {/* Badges/Trends */}
        <div className="flex items-center gap-2">
          {trend && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-accent-cyan/10 text-accent-cyan rounded-md border border-accent-cyan/20">
              {trend}
            </span>
          )}
          {status && status.type === 'live' && (
            <span className="text-[10px] flex items-center gap-1.5 px-2 py-0.5 bg-space-dark border border-space-border rounded-full text-accent-cyan font-bold">
              <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-pulse"></span>
              {status.text}
            </span>
          )}
          {status && status.type === 'record' && (
            <span className="text-[10px] flex items-center gap-1 px-2 py-0.5 bg-space-dark border border-space-border rounded-full text-accent-purple font-bold">
              {status.text}
            </span>
          )}
          {status && status.type === 'success' && (
            <span className="text-[10px] flex items-center gap-1 text-emerald-400 font-bold">
              {status.text}
            </span>
          )}
          {actionIcon && (
            <button
              onClick={onAction}
              className="text-space-muted hover:text-white transition-colors p-1"
            >
              {actionIcon}
            </button>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="my-2">
        <h3 className="text-3xl font-bold font-heading text-white tracking-tight">{value}</h3>
      </div>

      {/* Progress / Details footer */}
      <div className="w-full">
        {progress !== undefined && (
          <div className="w-full mt-2">
            <div className="w-full bg-space-dark border border-space-border h-1 rounded-full overflow-hidden">
              <div
                className="bg-accent-cyan h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        {subtext && (
          <p className="text-[11px] text-space-muted flex items-center gap-1 mt-1 font-medium">
            {subtext}
          </p>
        )}
        {avatars && (
          <div className="flex items-center -space-x-1.5 mt-2">
            {avatars.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="user"
                className="w-5 h-5 rounded-full border border-space-dark object-cover"
              />
            ))}
            <div className="w-5 h-5 rounded-full border border-space-dark bg-space-dark flex items-center justify-center text-[8px] font-bold text-accent-cyan">
              +14
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
