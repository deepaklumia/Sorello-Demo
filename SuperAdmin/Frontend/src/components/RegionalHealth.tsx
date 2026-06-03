import React from 'react';

interface RegionStatus {
  name: string;
  uptime: string;
}

const mockRegions: RegionStatus[] = [
  { name: 'North America', uptime: '99.99%' },
  { name: 'Europe Central', uptime: '100%' },
  { name: 'Asia Pacific', uptime: '98.4%' },
];

export const RegionalHealth: React.FC = () => {
  return (
    <div className="glass-card rounded-xl p-5 h-[280px] flex flex-col justify-between text-left">
      <span className="text-[10px] uppercase tracking-wider text-space-muted font-bold self-start">
        REGIONAL HEALTH
      </span>

      <div className="space-y-3.5 my-2">
        {mockRegions.map((region, i) => (
          <div key={i} className="flex justify-between items-center border-b border-space-border/20 pb-2 last:border-0 last:pb-0">
            <span className="text-xs text-space-muted font-semibold">{region.name}</span>
            <span className="text-xs font-bold text-accent-cyan">{region.uptime}</span>
          </div>
        ))}
      </div>
      
      {/* Visual status block */}
      <div className="bg-space-dark/60 rounded-lg p-2.5 border border-space-border/50 flex justify-between items-center">
        <span className="text-[9px] text-space-muted font-bold">ALL SYSTEMS</span>
        <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse"></span>
          OPTIMAL
        </span>
      </div>
    </div>
  );
};
