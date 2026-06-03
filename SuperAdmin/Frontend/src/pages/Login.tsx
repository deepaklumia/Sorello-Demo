import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Shield, Lock, Zap } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSession, setKeepSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      console.log("response", response);
      login(response.data.token, response.data.user, keepSession);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-center items-center relative overflow-hidden px-4">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main card */}
      <div className="glass-card rounded-2xl p-10 w-full max-w-[420px] z-10 relative shadow-2xl">
        {/* Logo/Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#0B0F19] border border-space-border flex items-center justify-center text-accent-cyan shadow-inner mb-4">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white tracking-tight">Sorello Admin</h2>
          <p className="text-[11px] text-space-muted font-bold mt-1.5 uppercase tracking-wider">Command Center Access</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/25 rounded-lg text-rose-400 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-space-muted text-sm font-semibold select-none">
                @
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sorello.com"
                className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-3.5 pl-10 pr-4 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
              Security Key
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-space-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-3.5 pl-10 pr-4 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none transition-all duration-300"
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
              Keep Session Active
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple hover:from-accent-cyan/90 hover:to-accent-purple/90 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.15)] disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <Zap className="w-3.5 h-3.5 fill-white" />
          </button>
        </form>

        {/* Footer */}
        <div className="flex flex-col items-center gap-3 mt-8 pt-6 border-t border-space-border/50 text-xs">
          <button
            onClick={() => alert('Please contact system administrator to reset password.')}
            className="text-space-muted hover:text-white transition-all font-semibold"
          >
            Forgot Password?
          </button>
          <Link
            to="/signup"
            className="text-space-muted hover:text-accent-cyan transition-all font-semibold"
          >
            Request Super Admin Account
          </Link>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="mt-8 flex justify-between items-center w-full max-w-[420px] px-2 text-[10px] text-space-muted font-bold tracking-wider z-10 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-pulse"></span>
          GLOBAL NODE: ACTIVE
        </div>
        <div>v2.4.12-Stable</div>
      </div>
    </div>
  );
};
