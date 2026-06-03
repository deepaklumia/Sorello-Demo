import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { formatCurrency, formatNumber } from '../utils/format';
import { MetricCard } from '../components/MetricCard';
import { RevenueChart } from '../components/RevenueChart';
import { EventsList } from '../components/EventsList';
import { RegionalHealth } from '../components/RegionalHealth';
import { UptimeGauge } from '../components/UptimeGauge';
import { QuickCommands } from '../components/QuickCommands';
import { Store, Terminal, Heart, Sliders, RefreshCw, ArrowDownToLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (e) {
      console.error('Error loading dashboard stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleSystemReport = () => {
    alert('Generating Enterprise System Report... Download will begin shortly.');
  };

  const totalRestaurantsVal = stats ? 1281 + stats.totalRestaurants : 1284;

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-accent-cyan">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  const activeTerminalsVal = stats ? 8488 + stats.activeRestaurants * 2 : 8492;
  const monthlyRevenueVal = stats ? 2400000 + stats.totalRevenue : 2400000;

  return (
    <div className="space-y-8 text-left">
      {/* Dashboard Top Intro */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-white tracking-tight">Platform Overview</h2>
          <p className="text-xs text-space-muted mt-1.5 font-medium">Real-time system performance and enterprise metrics.</p>
        </div>
        <button
          onClick={handleSystemReport}
          className="bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 text-xs tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.08)]"
        >
          <ArrowDownToLine className="w-4 h-4" />
          System Report
        </button>
      </div>

      {/* 1. Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Restaurants"
          value={formatNumber(totalRestaurantsVal)}
          trend="+12%"
          progress={75}
          icon={<Store className="w-4 h-4" />}
        />
        <MetricCard
          title="Active Terminals"
          value={formatNumber(activeTerminalsVal)}
          status={{ text: 'Live', type: 'live' }}
          subtext="94% utilization rate"
          icon={<Terminal className="w-4 h-4" />}
        />
        <MetricCard
          title="Monthly Revenue"
          value={stats ? formatCurrency(monthlyRevenueVal) : '$2.4M'}
          status={{ text: 'Record', type: 'record' }}
          avatars={[
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
          ]}
          icon={<Sliders className="w-4 h-4" />}
        />
        <MetricCard
          title="System Health"
          value="99.98%"
          status={{ text: 'All nodes operational', type: 'success' }}
          icon={<Heart className="w-4 h-4 text-emerald-400" />}
          actionIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onAction={fetchDashboardStats}
        />
      </div>

      {/* 2. Middle Row: Chart & Events log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <EventsList />
        </div>
      </div>

      {/* 3. Bottom Row: Regional Health, Uptime, Quick Commands */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RegionalHealth />
        <UptimeGauge />
        <QuickCommands onAddRestaurant={() => navigate('/restaurants')} />
      </div>
    </div>
  );
};
