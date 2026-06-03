import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { RevenueChart } from '../components/RevenueChart';
import { 
  ShoppingBag, 
  DollarSign, 
  ClipboardList, 
  TrendingUp, 
  UtensilsCrossed, 
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  restaurantName: string;
  todayOrders: number;
  totalOrders: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalMenuItems: number;
}

interface OrderItem {
  id: string;
  customerName: string;
  totalAmount: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const { restaurant } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [liveOrders, setLiveOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = restaurant?.slug || 'burger-palace';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Fetch dashboard overview stats
        const statsRes = await api.get('/restaurant/dashboard');
        setStats(statsRes.data);

        // 2. Fetch recent orders to show live/preparing orders
        const ordersRes = await api.get('/restaurant/orders?limit=5');
        if (ordersRes && ordersRes.data) {
          // Filter to show active/non-completed orders if possible, or just recent ones
          setLiveOrders(ordersRes.data);
        }
      } catch (err: any) {
        console.error('Failed to load dashboard data:', err);
        setError(err.message || 'Failed to fetch real-time dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getOrderStatusPillClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-amber-500/10 border border-amber-500/20 text-amber-400';
      case 'ACCEPTED':
      case 'PREPARED':
      case 'PREPARING':
        return 'bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan';
      case 'COMPLETED':
        return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
      case 'DECLINED':
        return 'bg-rose-500/10 border border-rose-500/20 text-rose-400';
      default:
        return 'bg-space-border/20 text-space-muted';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 rounded-full border-2 border-space-border border-t-accent-cyan animate-spin"></div>
        <p className="text-xs text-space-muted font-bold tracking-widest uppercase mt-4">Loading Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold font-heading text-white tracking-tight flex items-center gap-2">
            Welcome back, <span className="text-accent-cyan">{stats?.restaurantName || restaurant?.name}</span>
            <Sparkles className="w-5 h-5 text-accent-cyan animate-pulse" />
          </h2>
          <p className="text-xs text-space-muted mt-1 font-medium">
            Here's your real-time performance summary for today.
          </p>
        </div>
        
        <Link 
          to={`/${slug}/menu`}
          className="bg-accent-cyan text-[#0B0F19] hover:bg-opacity-90 font-bold px-4 py-2.5 rounded-lg text-xs tracking-wider flex items-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
        >
          <span className="text-base font-bold">+</span> New Order
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed flex items-center gap-2">
          <span>⚠️</span>
          <span>{error} - Displaying mock/cached view instead.</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Orders */}
        <div className="glass-card rounded-xl p-5 border border-space-border/60 relative overflow-hidden flex flex-col justify-between min-h-[110px] group hover:border-accent-cyan/40 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold">Today's Orders</p>
            <div className="w-8 h-8 rounded-lg bg-space-surface flex items-center justify-center text-accent-cyan">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-2xl font-extrabold text-white">{stats?.todayOrders ?? 45}</h3>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 mb-1 select-none">
              +8.4% ↗
            </span>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="glass-card rounded-xl p-5 border border-space-border/60 relative overflow-hidden flex flex-col justify-between min-h-[110px] group hover:border-accent-cyan/40 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold">Today's Revenue</p>
            <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center text-accent-cyan">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-2xl font-extrabold text-[#00F0FF]">
              {formatCurrency(stats?.todayRevenue ?? 450)}
            </h3>
            <span className="text-[10px] font-bold text-accent-cyan flex items-center gap-0.5 mb-1 select-none">
              Live
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-card rounded-xl p-5 border border-space-border/60 relative overflow-hidden flex flex-col justify-between min-h-[110px] group hover:border-accent-cyan/40 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold">Total Orders</p>
            <div className="w-8 h-8 rounded-lg bg-space-surface flex items-center justify-center text-space-muted group-hover:text-white transition-colors">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-2xl font-extrabold text-white">
              {stats?.totalOrders?.toLocaleString() ?? '1,500'}
            </h3>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="glass-card rounded-xl p-5 border border-space-border/60 relative overflow-hidden flex flex-col justify-between min-h-[110px] group hover:border-accent-cyan/40 transition-all duration-300">
          <div className="flex justify-between items-start">
            <p className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold">Monthly Revenue</p>
            <div className="w-8 h-8 rounded-lg bg-space-surface flex items-center justify-center text-space-muted group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex justify-between items-end mt-2">
            <h3 className="text-2xl font-extrabold text-white">
              {formatCurrency(stats?.monthlyRevenue ?? 12000)}
            </h3>
          </div>
        </div>
      </div>

      {/* Analytics & Side Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Graph */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 md:p-6 border border-space-border/60 flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-extrabold font-heading tracking-wide uppercase text-white">
              Weekly Revenue Analysis
            </h3>
            <div className="flex items-center gap-1 bg-[#101524] rounded-lg p-0.5 border border-space-border/40 text-[9px] font-extrabold">
              <button className="px-2.5 py-1 rounded text-space-muted">Daily</button>
              <button className="px-2.5 py-1 rounded bg-[#1C253D] text-accent-cyan font-extrabold">Weekly</button>
            </div>
          </div>
          <RevenueChart />
        </div>

        {/* Side Panel (Inventory & Popular Item) */}
        <div className="space-y-6 flex flex-col">
          {/* Menu Inventory Card */}
          <div className="glass-card rounded-xl p-6 border border-space-border/60 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#9D00FF]/15 flex items-center justify-center text-accent-purple">
                  <UtensilsCrossed className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">Menu Inventory</h3>
              </div>

              <div className="mt-5 text-left">
                <p className="text-3xl font-extrabold text-white flex items-baseline gap-1.5">
                  {stats?.totalMenuItems ?? 120} <span className="text-[10px] text-space-muted font-bold">Items</span>
                </p>
                <p className="text-[10px] text-space-muted font-bold mt-1">Across categories</p>
              </div>

              {/* Progress Gauges */}
              <div className="space-y-3 mt-6">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-space-muted mb-1">
                    <span>Active Dishes</span>
                    <span className="text-accent-cyan">
                      {Math.max(0, (stats?.totalMenuItems ?? 120) - 8)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-space-surface rounded-full overflow-hidden">
                    <div className="h-full bg-accent-cyan rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-space-muted mb-1">
                    <span>Unavailable</span>
                    <span className="text-rose-400">8</span>
                  </div>
                  <div className="h-1.5 w-full bg-space-surface rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to={`/${slug}/menu`}
              className="w-full text-center py-2.5 border border-space-border/80 hover:border-accent-cyan hover:text-accent-cyan rounded-lg text-[10px] font-extrabold tracking-wider transition-all uppercase mt-6 block"
            >
              Edit Menu
            </Link>
          </div>

          {/* Popular Item Widget */}
          <div className="glass-card rounded-xl p-5 border border-space-border/60">
            <p className="text-[9px] uppercase tracking-wider text-space-muted font-extrabold mb-3">
              Popular Item This Week
            </p>
            <div className="flex items-center gap-4 bg-space-surface/40 p-3 rounded-lg border border-space-border/40">
              <div className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0 border border-space-border" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&auto=format&fit=crop&q=80')` }}></div>
              <div className="text-left overflow-hidden flex-1">
                <h4 className="text-xs font-bold text-white truncate">Cyber Burger</h4>
                <p className="text-[10px] text-space-muted font-semibold truncate mt-0.5">42 Sold today</p>
                <span className="inline-block text-[8px] bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan px-2 py-0.5 rounded font-extrabold uppercase mt-1.5 tracking-wider">
                  Trending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Orders (Preparing) Grid */}
      <div className="glass-card rounded-xl border border-space-border/60 overflow-hidden">
        <div className="p-5 border-b border-space-border/50 flex justify-between items-center">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">Live Orders (Preparing)</h3>
          <Link 
            to={`/${slug}/orders`}
            className="text-[10px] font-bold text-accent-cyan hover:underline flex items-center gap-1"
          >
            View all orders <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-space-surface/30 border-b border-space-border/30 text-space-muted select-none text-[9px] uppercase tracking-wider">
                <th className="py-3.5 px-6 text-left font-extrabold">Order ID</th>
                <th className="py-3.5 px-6 text-left font-extrabold">Customer</th>
                <th className="py-3.5 px-6 text-left font-extrabold">Total</th>
                <th className="py-3.5 px-6 text-left font-extrabold">Time</th>
                <th className="py-3.5 px-6 text-left font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-border/20">
              {liveOrders.length > 0 ? (
                liveOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-space-surface/20 transition-all duration-150">
                    <td className="py-4 px-6 font-extrabold text-accent-cyan select-all">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      {order.customerName}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-white">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-space-muted font-semibold flex items-center gap-1.5 mt-1.5 border-none">
                      <Clock className="w-3.5 h-3.5 text-space-muted" />
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider select-none ${getOrderStatusPillClass(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 px-6 text-center text-space-muted font-semibold">
                    No active live orders preparing at this time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
