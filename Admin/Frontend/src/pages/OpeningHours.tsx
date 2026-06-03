import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { 
  AlertCircle, 
  CheckCircle2, 
  ToggleLeft, 
  ToggleRight,
  Info,
  RotateCcw
} from 'lucide-react';

interface HoursConfig {
  id?: string;
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
  isClosed: boolean;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' }
];

// Helper to generate 24h dropdown hours options in HH:MM format
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const min = (i % 2) * 30;
  const hh = hour.toString().padStart(2, '0');
  const mm = min.toString().padStart(2, '0');
  const labelHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const labelMin = mm;
  
  return {
    value: `${hh}:${mm}`,
    label: `${labelHour}:${labelMin} ${ampm}`
  };
});

export const OpeningHours: React.FC = () => {
  const [hoursList, setHoursList] = useState<HoursConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Initialize schedule structure with standard defaults
  const getDefaultDayConfig = (day: number): HoursConfig => ({
    dayOfWeek: day,
    openingTime: '08:00',
    closingTime: '22:00',
    isClosed: false
  });

  const loadHoursData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get('/restaurant/hours');
      const loaded: HoursConfig[] = res.data || [];
      
      // Ensure all 7 days of the week are mapped
      const completeList = DAYS_OF_WEEK.map(({ value }) => {
        const found = loaded.find(h => h.dayOfWeek === value);
        return found ? { ...found } : getDefaultDayConfig(value);
      });
      
      setHoursList(completeList);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load weekly schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHoursData();
  }, []);

  const handleFieldChange = (dayOfWeek: number, field: keyof HoursConfig, value: any) => {
    setHoursList(prev => prev.map(item => {
      if (item.dayOfWeek === dayOfWeek) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSaveHours = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      // Save each day sequentially or in parallel
      const savePromises = hoursList.map(async (day) => {
        const payload = {
          dayOfWeek: day.dayOfWeek,
          openingTime: day.openingTime,
          closingTime: day.closingTime,
          isClosed: day.isClosed
        };

        if (day.id) {
          // Update existing day configuration
          return api.put(`/restaurant/hours/${day.id}`, payload);
        } else {
          // Create new day configuration
          return api.post('/restaurant/hours', payload);
        }
      });

      await Promise.all(savePromises);
      
      setSuccessMessage('Weekly opening hours updated successfully across customer apps.');
      
      // Reload updated list to bind database IDs to new rows
      await loadHoursData();

      // Clear success notification after 4 seconds
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to save hours:', err);
      setError(err.message || 'Failed to save operating schedule configuration.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSchedule = () => {
    if (window.confirm('Reset all days to standard defaults (08:00 AM - 10:00 PM)? Unsaved changes will be lost.')) {
      setHoursList(DAYS_OF_WEEK.map(({ value }) => getDefaultDayConfig(value)));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 rounded-full border-2 border-space-border border-t-accent-cyan animate-spin"></div>
        <p className="text-xs text-space-muted font-bold tracking-widest uppercase mt-4">Loading Operating Schedule...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold font-heading text-white tracking-tight">
          Weekly Opening Hours
        </h2>
        <p className="text-xs text-space-muted mt-1 font-medium">
          Configure your restaurant's operating schedule. Changes update in real-time across customer platforms.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold leading-relaxed flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.08)]">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Scheduler Form Table */}
      <div className="glass-card rounded-xl border border-space-border/60 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-space-surface/30 border-b border-space-border/40 text-space-muted select-none text-[9px] uppercase tracking-wider">
                <th className="py-4 px-6 text-left font-extrabold w-[25%]">Day</th>
                <th className="py-4 px-6 text-left font-extrabold w-[30%]">Opening Time</th>
                <th className="py-4 px-6 text-left font-extrabold w-[30%]">Closing Time</th>
                <th className="py-4 px-6 text-center font-extrabold w-[15%]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-border/20">
              {hoursList.map((day) => {
                const dayLabelObj = DAYS_OF_WEEK.find(d => d.value === day.dayOfWeek);
                const dayLabel = dayLabelObj ? dayLabelObj.label : 'Day';

                return (
                  <tr 
                    key={day.dayOfWeek} 
                    className={`hover:bg-space-surface/10 transition-all duration-150 ${
                      day.isClosed ? 'opacity-50 bg-[#0B0F19]/40' : ''
                    }`}
                  >
                    {/* Day label */}
                    <td className="py-4 px-6 font-bold text-white text-xs select-none">
                      {dayLabel}
                    </td>

                    {/* Opening selector */}
                    <td className="py-4 px-6">
                      <select
                        disabled={day.isClosed}
                        value={day.openingTime}
                        onChange={(e) => handleFieldChange(day.dayOfWeek, 'openingTime', e.target.value)}
                        className="bg-[#0B0F19] border border-space-border/80 rounded-lg py-2 px-3 text-xs text-white focus:border-accent-cyan focus:outline-none w-full max-w-[200px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {TIME_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-space-dark text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Closing selector */}
                    <td className="py-4 px-6">
                      <select
                        disabled={day.isClosed}
                        value={day.closingTime}
                        onChange={(e) => handleFieldChange(day.dayOfWeek, 'closingTime', e.target.value)}
                        className="bg-[#0B0F19] border border-space-border/80 rounded-lg py-2 px-3 text-xs text-white focus:border-accent-cyan focus:outline-none w-full max-w-[200px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {TIME_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-space-dark text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Closed Switch Toggle */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleFieldChange(day.dayOfWeek, 'isClosed', !day.isClosed)}
                        className="p-1 focus:outline-none transition-colors"
                        title={day.isClosed ? 'Mark Open' : 'Mark Closed'}
                      >
                        {day.isClosed ? (
                          <div className="flex flex-col items-center gap-0.5 text-rose-400 font-extrabold select-none">
                            <ToggleLeft className="w-7 h-7 text-space-muted" />
                            <span className="text-[8px] uppercase tracking-wide">Closed</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-0.5 text-emerald-400 font-extrabold select-none">
                            <ToggleRight className="w-7 h-7 text-accent-cyan" />
                            <span className="text-[8px] uppercase tracking-wide text-accent-cyan">Active</span>
                          </div>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer controls panel */}
        <div className="p-5 border-t border-space-border/40 bg-[#0E1322]/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] text-space-muted font-bold tracking-wider select-none uppercase">
            <Info className="w-4 h-4 text-accent-cyan" />
            <span>All times are configured in Local Standard Time (24h clock)</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleResetSchedule}
              className="flex-1 sm:flex-initial bg-transparent border border-space-border/60 hover:border-white text-space-muted hover:text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Schedule
            </button>
            
            <button
              onClick={handleSaveHours}
              disabled={submitting}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold px-6 py-2.5 rounded-lg text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.15)] disabled:opacity-50"
            >
              {submitting ? 'Saving changes...' : 'Save Weekly Hours'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OpeningHours;
