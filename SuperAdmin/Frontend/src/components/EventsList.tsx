import React from 'react';
import { ShieldCheck, Cloud, AlertTriangle, RefreshCw } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'security' | 'deployment' | 'auth_error';
}

const mockEvents: EventItem[] = [
  {
    id: '1',
    title: 'Security Audit Completed',
    description: 'Deepak Kumar initiated full system scan. 0 vulnerabilities found.',
    time: '14 MINS AGO',
    type: 'security',
  },
  {
    id: '2',
    title: 'New Region Deployment',
    description: 'APAC-South cluster successfully scaled to 4 nodes.',
    time: '2 HOURS AGO',
    type: 'deployment',
  },
  {
    id: '3',
    title: 'Failed Authentication',
    description: 'Multiple failed login attempts from IP 192.168.1.44.',
    time: '4 HOURS AGO',
    type: 'auth_error',
  },
];

export const EventsList: React.FC = () => {
  return (
    <div className="glass-card rounded-xl p-5 h-[360px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide font-heading">SYSTEM EVENTS</h4>
          <p className="text-xs text-space-muted">Audit trail of critical alerts</p>
        </div>
        <button className="text-space-muted hover:text-white transition-all">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
        {mockEvents.map((evt) => {
          const Icon =
            evt.type === 'security'
              ? ShieldCheck
              : evt.type === 'deployment'
              ? Cloud
              : AlertTriangle;

          const iconColor =
            evt.type === 'security'
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : evt.type === 'deployment'
              ? 'text-accent-purple bg-accent-purple/10 border-accent-purple/20'
              : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

          return (
            <div
              key={evt.id}
              className="flex gap-3 p-3 bg-space-dark/45 border border-space-border/50 rounded-lg hover:border-space-border transition-colors duration-200"
            >
              <div className={`p-2 rounded-lg border h-9 w-9 flex items-center justify-center shrink-0 ${iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h5 className="text-[11px] font-bold text-white truncate">{evt.title}</h5>
                  <span className="text-[9px] font-bold text-space-muted whitespace-nowrap">{evt.time}</span>
                </div>
                <p className="text-[11px] text-space-muted mt-0.5 leading-relaxed">{evt.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
