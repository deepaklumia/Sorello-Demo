import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Crown
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { restaurant, updateProfileState } = useAuth();
  
  // States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Sync profile details
  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name || '');
      setPhone(restaurant.phone || '');
      setAddress(restaurant.address || '');
    }
  }, [restaurant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await api.put('/restaurant/profile', {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim()
      });

      // Update global context profile state
      updateProfileState(res.data);
      setSuccess(true);
      
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update restaurant profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold font-heading text-white tracking-tight">
          Restaurant Settings
        </h2>
        <p className="text-xs text-space-muted mt-1 font-medium">
          Manage your restaurant credentials, store location metadata, and plan details.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold leading-relaxed flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile configuration saved successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Card: Read-only subscription plan summary */}
        <div className="lg:col-span-1 glass-card rounded-xl p-5 border border-space-border/60 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-space-border/30">
            <Crown className="w-4 h-4 text-accent-cyan" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">Console Status</h3>
          </div>

          <div className="space-y-4">
            {/* Slug */}
            <div>
              <p className="text-[9px] uppercase tracking-wider text-space-muted font-extrabold">Dynamic Domain Link</p>
              <p className="text-xs font-bold text-accent-cyan mt-1 select-all">
                /{restaurant?.slug || 'burger-palace'}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-[9px] uppercase tracking-wider text-space-muted font-extrabold">Primary Administrator</p>
              <p className="text-xs font-bold text-white mt-1 select-all">
                {restaurant?.email || 'admin@sorello.com'}
              </p>
            </div>

            {/* Tier */}
            <div>
              <p className="text-[9px] uppercase tracking-wider text-space-muted font-extrabold">Subscription Plan</p>
              <span className="inline-block bg-accent-purple/20 border border-accent-purple/35 text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mt-1.5 shadow-[0_0_15px_rgba(157,0,255,0.1)]">
                {restaurant?.subscriptionPlan || 'Premium Tier'}
              </span>
            </div>

            {/* Status */}
            <div>
              <p className="text-[9px] uppercase tracking-wider text-space-muted font-extrabold">System State</p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE / ONLINE
              </div>
            </div>
          </div>
        </div>

        {/* Right Form: Update profile fields */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-space-border/60">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-white border-b border-space-border/30 pb-3 mb-5">
            Store Profile Information
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Store Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                Restaurant Brand Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-space-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Burger Palace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2.5 pl-10 pr-4 text-xs text-white focus:border-accent-cyan focus:outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-space-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2.5 pl-10 pr-4 text-xs text-white focus:border-accent-cyan focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                Store Location Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-space-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. 104 Main St, Suite B, Boston, MA"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2.5 pl-10 pr-4 text-xs text-white focus:border-accent-cyan focus:outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold py-2.5 px-6 rounded-lg text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.15)] disabled:opacity-50"
              >
                {loading ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
export default Settings;
