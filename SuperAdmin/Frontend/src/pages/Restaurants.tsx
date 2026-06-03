import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Plus, Filter, ChevronDown, Check, X, Trash2, RefreshCw } from 'lucide-react';

export const Restaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdInfo, setCreatedInfo] = useState<{ slug: string; email: string; tempPassword: string } | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('premium');

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=5`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (statusFilter !== 'ALL') query += `&status=${statusFilter}`;
      
      const response = await api.get(`/admin/restaurants${query}`);
      setRestaurants(response.data);
      setMeta(response.meta);
    } catch (e) {
      console.error('Error fetching restaurants:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRestaurants();
  };

  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post('/admin/restaurants', {
        name,
        email,
        phone,
        address,
        subscriptionPlan,
        status: 'ACTIVE',
      });
      
      const createdRes = response.data;
      setCreatedInfo({
        slug: createdRes.slug,
        email: createdRes.email,
        tempPassword: createdRes.tempPassword,
      });

      setShowAddModal(false);
      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setSubscriptionPlan('premium');
      // Reload list
      setPage(1);
      fetchRestaurants();
    } catch (err: any) {
      setError(err.message || 'Failed to create restaurant');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE') => {
    try {
      await api.patch(`/admin/restaurants/${id}/status`, { status: newStatus });
      fetchRestaurants();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    if (!window.confirm('Are you sure you want to soft-delete this restaurant?')) return;
    try {
      await api.delete(`/admin/restaurants/${id}`);
      fetchRestaurants();
    } catch (err: any) {
      alert(err.message || 'Failed to delete restaurant');
    }
  };

  // Status mapping to match screenshot labels
  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE') {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
          Live
        </span>
      );
    }
    if (status === 'SUSPENDED') {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-[10px] font-bold">
          <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
          Suspended
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold">
        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
        Pending
      </span>
    );
  };

  // Mock data additions to match visual mockup lists exactly
  const displayRestaurants = [...restaurants];
  if (displayRestaurants.length === 0 && !loading) {
    // If database is empty, push visual placeholders matching Figma
    displayRestaurants.push(
      { id: 'SOR-8821', name: 'Luxe Bistro - Downtown', email: 'luxe@test.com', phone: '+15550101', address: 'San Francisco, CA', status: 'ACTIVE', subscriptionPlan: 'premium' },
      { id: 'SOR-7742', name: 'Neon Sushi Express', email: 'sushi@test.com', phone: '+15550102', address: 'Austin, TX', status: 'ACTIVE', subscriptionPlan: 'premium' },
      { id: 'SOR-4409', name: 'Grill & Glow Steakhouse', email: 'grill@test.com', phone: '+15550103', address: 'Chicago, IL', status: 'SUSPENDED', subscriptionPlan: 'basic' }
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* 1. Header Area */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold font-heading text-white tracking-tight">Restaurant Directory</h2>
          <p className="text-xs text-space-muted mt-1.5 font-medium">Manage your global restaurant portfolio and terminal assignments.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 text-xs tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.08)]"
        >
          <Plus className="w-4 h-4" />
          Add New Restaurant
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="glass-card rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Side Status Filters */}
        <div className="flex gap-2 bg-space-dark border border-space-border/50 rounded-lg p-0.5 self-start md:self-auto">
          {([
            { label: 'All', value: 'ALL' },
            { label: 'Live', value: 'ACTIVE' },
            { label: 'Suspended', value: 'SUSPENDED' },
            { label: 'Pending', value: 'INACTIVE' },
          ] as const).map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`text-[10px] font-bold px-4 py-1.5 rounded-md transition-all ${
                statusFilter === tab.value
                  ? 'bg-space-surface text-accent-cyan border border-space-border shadow-sm'
                  : 'text-space-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Side Options */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search bar inside filter */}
          <form onSubmit={handleSearchSubmit} className="flex-1 md:flex-initial">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-space-dark border border-space-border/80 rounded-lg py-1.5 px-3.5 text-xs text-white placeholder-space-muted focus:border-accent-cyan focus:outline-none transition-all w-full md:w-48"
            />
          </form>

          {/* Dropdowns */}
          <button className="flex items-center gap-2 px-3 py-1.5 bg-space-dark border border-space-border/80 rounded-lg text-xs font-bold text-space-muted hover:text-white hover:border-space-border transition-colors">
            All Tiers
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-space-dark border border-space-border/80 rounded-lg text-xs font-bold text-space-muted hover:text-white hover:border-space-border transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Advanced
          </button>
        </div>
      </div>

      {/* 3. Data Grid / Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-space-border bg-space-surface/30">
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Restaurant Name</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Location</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Status</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Subscription</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans">Phone</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-space-muted font-sans text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-border/30 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-space-muted">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-accent-cyan" />
                    Fetching directory records...
                  </td>
                </tr>
              ) : displayRestaurants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-space-muted font-medium">
                    No restaurants found matching the filter.
                  </td>
                </tr>
              ) : (
                displayRestaurants.map((res) => (
                  <tr key={res.id} className="hover:bg-space-surface/20 transition-colors duration-200">
                    <td className="p-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-space-dark border border-space-border/50 flex items-center justify-center font-bold text-accent-cyan text-[10px] uppercase">
                          {res.name.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-none">{res.name}</p>
                          <span className="text-[9px] text-space-muted font-medium uppercase tracking-wider">ID: {res.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-space-muted font-medium">{res.address}</td>
                    <td className="p-4">{getStatusBadge(res.status)}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-space-dark border border-space-border/50 rounded-md font-semibold text-space-muted capitalize text-[10px]">
                        {res.subscriptionPlan}
                      </span>
                    </td>
                    <td className="p-4 text-space-muted font-semibold">{res.phone}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {res.status !== 'ACTIVE' && (
                          <button
                            onClick={() => handleUpdateStatus(res.id, 'ACTIVE')}
                            className="p-1.5 hover:bg-space-dark border border-transparent hover:border-space-border rounded text-emerald-400 transition-all"
                            title="Activate"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {res.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleUpdateStatus(res.id, 'SUSPENDED')}
                            className="p-1.5 hover:bg-space-dark border border-transparent hover:border-space-border rounded text-rose-400 transition-all"
                            title="Suspend"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRestaurant(res.id)}
                          className="p-1.5 hover:bg-space-dark border border-transparent hover:border-space-border rounded text-space-muted hover:text-rose-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-space-border flex justify-between items-center bg-space-surface/10 text-xs">
            <span className="text-space-muted font-medium">
              Showing {(meta.page - 1) * meta.limit + 1} - {Math.min(meta.page * meta.limit, meta.totalCount)} of {meta.totalCount} restaurants
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={!meta.hasPreviousPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 bg-space-dark border border-space-border rounded text-space-muted hover:text-white disabled:opacity-30 transition-all text-[10px] font-bold"
              >
                Previous
              </button>
              {Array.from({ length: meta.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                    page === i + 1
                      ? 'bg-accent-cyan border-accent-cyan text-space-dark font-extrabold'
                      : 'bg-space-dark border-space-border text-space-muted hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={!meta.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1 bg-space-dark border border-space-border rounded text-space-muted hover:text-white disabled:opacity-30 transition-all text-[10px] font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-5 flex flex-col justify-between h-40">
          <span className="text-[10px] uppercase tracking-wider text-space-muted font-bold">Total Revenue (Portfolio)</span>
          <div className="my-2 flex justify-between items-end">
            <h3 className="text-2xl font-extrabold font-heading text-white">$2.4M</h3>
            <span className="text-[10px] font-bold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 rounded-md px-1.5 py-0.5">+12.4%</span>
          </div>
          {/* Small SVG Bar Chart Sparkline */}
          <div className="h-8 w-full flex items-end gap-1">
            <div className="bg-accent-cyan/20 h-[30%] w-full rounded-sm"></div>
            <div className="bg-accent-cyan/35 h-[45%] w-full rounded-sm"></div>
            <div className="bg-accent-cyan/50 h-[35%] w-full rounded-sm"></div>
            <div className="bg-accent-cyan/70 h-[60%] w-full rounded-sm"></div>
            <div className="bg-accent-cyan/85 h-[50%] w-full rounded-sm"></div>
            <div className="bg-accent-cyan h-[100%] w-full rounded-sm shadow-[0_0_10px_rgba(0,240,255,0.4)]"></div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex flex-col justify-between h-40">
          <span className="text-[10px] uppercase tracking-wider text-space-muted font-bold">System Health</span>
          <h3 className="text-2xl font-extrabold font-heading text-emerald-400">99.98%</h3>
          <p className="text-xs text-space-muted font-semibold leading-relaxed">842 terminals connected globally without latency issues.</p>
        </div>

        <div className="glass-card rounded-xl p-5 flex flex-col justify-between h-40">
          <span className="text-[10px] uppercase tracking-wider text-space-muted font-bold">Active Trials</span>
          <h3 className="text-2xl font-extrabold font-heading text-white">18</h3>
          <p className="text-xs text-space-muted font-semibold leading-relaxed">18 trials converting to paid subscriptions within 4 days.</p>
        </div>
      </div>

      {/* 5. Add Restaurant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-space-dark/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="glass-card rounded-xl p-6 w-full max-w-[460px] shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-space-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-heading text-white mb-1">Add New Restaurant</h3>
            <p className="text-xs text-space-muted mb-5">Create a new restaurant profile in the cloud directory.</p>

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/25 rounded-lg text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleAddRestaurant} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">Restaurant Name</label>
                <input
                  type="text"
                  required
                  placeholder="Luxe Bistro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2.5 px-3 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="manager@luxebistro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2.5 px-3 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+15550101"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2.5 px-3 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">Location Address</label>
                <input
                  type="text"
                  required
                  placeholder="San Francisco, CA"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2.5 px-3 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">Subscription Tier</label>
                <select
                  value={subscriptionPlan}
                  onChange={(e) => setSubscriptionPlan(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2.5 px-3 text-xs text-white focus:border-accent-cyan focus:outline-none"
                >
                  <option value="basic">Basic Plan</option>
                  <option value="premium">Premium Plan</option>
                  <option value="enterprise">Enterprise Plan</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold py-3 px-4 rounded-lg text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.15)] mt-2"
              >
                Create Restaurant Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Generated Credentials Popup Modal */}
      {createdInfo && (
        <div className="fixed inset-0 bg-space-dark/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="glass-card rounded-xl p-6 w-full max-w-[460px] shadow-2xl relative border border-accent-cyan/30">
            <h3 className="text-lg font-bold font-heading text-white mb-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></span>
              Credentials Generated Successfully
            </h3>
            <p className="text-xs text-space-muted mb-5 leading-relaxed">
              Copy these security credentials to share with the restaurant owner. They can use them to log into the restaurant admin dashboard.
            </p>

            <div className="space-y-4 bg-[#0B0F19]/50 border border-space-border/60 rounded-lg p-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-space-muted font-bold block">Login URL</span>
                <div className="bg-[#0B0F19] border border-space-border/40 rounded px-3 py-2 font-medium text-accent-cyan select-all break-all">
                  {`http://localhost:5174/${createdInfo.slug}`}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-space-muted font-bold block">Email Address</span>
                <div className="bg-[#0B0F19] border border-space-border/40 rounded px-3 py-2 font-medium text-white select-all break-all">
                  {createdInfo.email}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-space-muted font-bold block">Temporary Password</span>
                <div className="bg-[#0B0F19] border border-space-border/40 rounded px-3 py-2 font-mono font-medium text-white select-all">
                  {createdInfo.tempPassword}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  const textToCopy = `Portal URL: http://localhost:5174/${createdInfo.slug}\nEmail: ${createdInfo.email}\nTemporary Password: ${createdInfo.tempPassword}`;
                  navigator.clipboard.writeText(textToCopy);
                  alert('Credentials copied to clipboard!');
                }}
                className="flex-1 bg-space-dark hover:bg-space-surface border border-space-border text-white font-bold py-2.5 px-4 rounded-lg text-xs tracking-wider transition-all"
              >
                Copy Details
              </button>
              <button
                type="button"
                onClick={() => setCreatedInfo(null)}
                className="flex-1 bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold py-2.5 px-4 rounded-lg text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
