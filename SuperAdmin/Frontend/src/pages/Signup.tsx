import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Shield, Mail, Lock, User, Eye, EyeOff, Info } from 'lucide-react';

export const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/auth/register', {
        email,
        passwordPlain: password,
        name,
        role: 'SUPER_ADMIN',
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check parameters.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-center items-center relative overflow-hidden px-4 py-8">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6 z-10 select-none">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-cyan to-accent-purple flex items-center justify-center font-bold text-white shadow-lg text-sm">
          S
        </div>
        <span className="text-sm font-extrabold tracking-widest text-white font-heading uppercase">
          SORELLO ADMIN
        </span>
      </div>

      {/* Main card */}
      <div className="glass-card rounded-2xl p-8 w-full max-w-[460px] z-10 relative shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold font-heading text-white tracking-tight">Create Super Admin</h2>
          <p className="text-xs text-space-muted font-medium mt-1">Register platform controller account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/25 rounded-lg text-rose-400 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400 text-xs font-semibold leading-relaxed">
            Super Admin created successfully! Redirecting to login...
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-space-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-3 pl-10 pr-4 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-space-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@sorello.com"
                className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-3 pl-10 pr-4 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-space-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-3 pl-10 pr-10 text-xs text-white placeholder-space-muted/50 focus:border-accent-cyan focus:outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-space-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Platform Role (Fixed to SUPER_ADMIN) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              <label className="text-[10px] uppercase tracking-wider text-space-muted font-extrabold block">
                Platform Role
              </label>
              <span className="cursor-help" title="Only SUPER_ADMIN users can be created through this secure registration portal.">
                <Info className="w-3 h-3 text-space-muted" />
              </span>
            </div>
            <div className="w-full bg-[#0B0F19] border border-space-border rounded-lg py-3 px-4 flex justify-between items-center text-xs select-none">
              <span className="flex items-center gap-2 px-2.5 py-0.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full text-accent-cyan font-bold text-[10px]">
                <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full"></span>
                SUPER_ADMIN
              </span>
              <Shield className="w-4 h-4 text-space-muted" />
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple hover:from-accent-cyan/90 hover:to-accent-purple/90 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.15)] disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : 'Register Account'}
            <span className="text-sm font-semibold">➔</span>
          </button>
        </form>

        {/* Footer */}
        <div className="flex flex-col items-center mt-6 pt-4 border-t border-space-border/50 text-xs">
          <p className="text-space-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-cyan hover:underline font-semibold ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom meta icons */}
      <div className="mt-8 flex justify-center gap-6 items-center w-full max-w-[460px] text-[8px] text-space-muted font-extrabold tracking-widest z-10 select-none uppercase">
        <span className="flex items-center gap-1">🔒 SSL_ENCRYPTED</span>
        <span className="flex items-center gap-1">📁 CORE_DB_CLUSTER_B</span>
        <span className="flex items-center gap-1">🔑 AUTH_V3</span>
      </div>
    </div>
  );
};
