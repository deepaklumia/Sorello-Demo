import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Shield, Mail, Lock, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSession, setKeepSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Setup Permanent Credentials states
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupSuccess, setSetupSuccess] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);

  const activeSlug = slug || 'burger-palace';
  
  // Format slug to readable name (e.g. burger-palace -> Burger Palace)
  const displayName = activeSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/restaurant-auth/login', {
        slug: activeSlug,
        email,
        password,
      });

      login(response.data.token, response.data.restaurant, keepSession);
      navigate(`/${activeSlug}/dashboard`);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError(null);
    setSetupLoading(true);

    try {
      // 1. Authenticate with temporary password first to obtain JWT token
      const loginRes = await api.post('/restaurant-auth/login', {
        slug: activeSlug,
        email,
        password: tempPassword,
      });

      const token = loginRes.data.token;

      // 2. Change password using the authenticated token
      await fetch('http://localhost:5003/api/restaurant-auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: tempPassword,
          newPassword: newPassword,
        })
      });

      setSetupSuccess(true);
      setTempPassword('');
      setNewPassword('');
      
      // Auto close after 2.5 seconds and prompt regular login
      setTimeout(() => {
        setShowSetupModal(false);
        setSetupSuccess(false);
        setError('Password configured successfully! Please sign in with your new password.');
      }, 2500);
    } catch (err: any) {
      setSetupError(err.message || 'Failed to update credentials. Check your input.');
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-[40%] w-[600px] h-[600px] bg-accent-purple/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Left Pane - Login card */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center items-center p-6 z-10 relative">
        
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-space-surface border border-space-border flex items-center justify-center text-accent-cyan shadow-inner mb-4">
            <Shield className="w-7 h-7 text-accent-cyan" />
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-white tracking-tight">
            {displayName}
          </h1>
          <p className="text-[10px] text-space-muted font-bold mt-1.5 uppercase tracking-widest">
            Command Center Alpha
          </p>
        </div>

        {/* Main card */}
        <div className="glass-card rounded-2xl p-8 w-full max-w-[420px] shadow-2xl border border-space-border/60">
          <div className="mb-6 text-left">
            <h2 className="text-lg font-bold font-heading text-white">
              Welcome to {displayName}
            </h2>
            <p className="text-xs text-space-muted mt-1 leading-relaxed">
              Enter your admin credentials to access the console.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2.5 text-rose-400 text-xs font-semibold leading-relaxed text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-space-muted absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@stellarbistro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-3 pl-10 pr-4 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                  Security Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact POS Super Admin to request credential reset.')}
                  className="text-[10px] font-bold text-accent-cyan hover:underline"
                >
                  Forgot Access?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-space-muted absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-3 pl-10 pr-4 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center">
              <input
                id="keep-session"
                type="checkbox"
                checked={keepSession}
                onChange={(e) => setKeepSession(e.target.checked)}
                className="w-4 h-4 bg-[#0B0F19] border-space-border rounded focus:ring-accent-cyan accent-accent-cyan cursor-pointer"
              />
              <label
                htmlFor="keep-session"
                className="ml-2.5 text-xs text-space-muted font-semibold select-none cursor-pointer"
              >
                Maintain secure session for 24h
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-90 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.15)] disabled:opacity-50 mt-2"
            >
              {loading ? 'Initializing...' : 'Initialize Access'}
              <span className="text-sm font-semibold">➔</span>
            </button>
          </form>

          {/* Setup Credentials Link */}
          <div className="mt-6 pt-5 border-t border-space-border/50 text-center">
            <button
              onClick={() => setShowSetupModal(true)}
              className="text-space-muted hover:text-accent-cyan transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Setup Permanent Credentials
            </button>
          </div>
        </div>

        {/* Footer meta text */}
        <p className="text-[9px] text-space-muted/55 font-bold uppercase tracking-widest mt-8 select-none">
          Version 4.2.0-Aurora | Systems Nominal
        </p>
      </div>

      {/* Right Pane - Visual tech board graphics */}
      <div className="hidden lg:block lg:w-[50%] h-screen relative bg-[#090C14] border-l border-space-border/30">
        {/* Abstract motherboard circuit design background */}
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
          {/* Cyber board core graphic */}
          <div className="w-[450px] h-[450px] rounded-full border border-space-border/30 flex items-center justify-center animate-[spin_120s_linear_infinite] relative">
            <div className="w-[320px] h-[320px] rounded-full border border-space-border/20 flex items-center justify-center">
              <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-accent-cyan/10 to-accent-purple/10 border border-space-border/30"></div>
            </div>
            {/* Satellite glows */}
            <div className="absolute top-[10%] left-[10%] w-3 h-3 bg-accent-cyan rounded-full shadow-[0_0_15px_#00F0FF]"></div>
            <div className="absolute bottom-[20%] right-[15%] w-3.5 h-3.5 bg-accent-purple rounded-full shadow-[0_0_15px_#9D00FF]"></div>
          </div>
        </div>
      </div>

      {/* Setup Credentials Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-space-dark/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="glass-card rounded-xl p-6 w-full max-w-[440px] shadow-2xl border border-space-border relative text-left">
            <button
              onClick={() => {
                setShowSetupModal(false);
                setSetupError(null);
                setSetupSuccess(false);
              }}
              className="absolute top-4 right-4 text-space-muted hover:text-white transition-colors"
            >
              ✕
            </button>

            <h3 className="text-base font-bold font-heading text-white mb-1">
              Setup Permanent Credentials
            </h3>
            <p className="text-xs text-space-muted mb-5 leading-relaxed">
              If this is your first time logging in, convert your generated temporary security password to a permanent one.
            </p>

            {setupError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-semibold leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{setupError}</span>
              </div>
            )}

            {setupSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-semibold leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Credentials configured successfully! Closing form...</span>
              </div>
            )}

            <form onSubmit={handleSetupCredentials} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="owner@pizza.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                  Temporary Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="temp_ab1234"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                  New Permanent Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={setupLoading || setupSuccess}
                className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold py-3 px-4 rounded-lg text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.15)] disabled:opacity-50 mt-2"
              >
                {setupLoading ? 'Configuring Credentials...' : 'Save Permanent Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Login;
