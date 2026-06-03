import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setError(null);
    setLoading(true);

    try {
      // Connect to the newly implemented backend login API
      const response = await fetch('http://localhost:5003/api/restaurant-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: 'family-rest',
          email: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please verify credentials.');
      }

      // Save token and restaurant details in store & localstorage
      login(data.data.token, data.data.restaurant);

      // Redirect to KDS page
      navigate('/orders');
    } catch (err: any) {
      setError(err.message || 'Connection error. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5FD] flex flex-col justify-between select-none font-sans">
      {/* Top Header */}
      <header className="w-full px-8 py-5 flex justify-between items-center bg-[#F0F5FD]">
        <div className="text-xl font-black text-[#0B56D6] tracking-tight">
          Sorella
        </div>
        <button
          onClick={() => alert('Support portal is offline. Please contact terminal administrator.')}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
        >
          Support
        </button>
      </header>

      {/* Main Login Panel */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_10px_40px_-10px_rgba(11,86,214,0.12)]">
          {/* Cash Register Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#0B56D6] flex items-center justify-center shadow-lg shadow-[#0B56D6]/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white"
              >
                <path d="M4 19h16" />
                <path d="M4 15h16" />
                <rect x="6" y="3" width="12" height="8" rx="2" />
                <path d="M10 7h4" />
                <path d="M8 15v4" />
                <path d="M12 15v4" />
                <path d="M16 15v4" />
                <path d="M5 11h14l1 4H4z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs font-semibold text-gray-500 mt-1">
              Sign in to your Sorella terminal.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-left text-xs font-semibold text-red-500 leading-normal">
              {error}
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-5 text-left">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Username or Email
              </label>
              <div className="relative flex items-center bg-white border border-gray-200 rounded-xl focus-within:border-[#0B56D6] transition-colors">
                <User className="w-4 h-4 text-gray-400 absolute left-4" />
                <input
                  type="text"
                  required
                  placeholder="Enter your credentials"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent pl-11 pr-4 py-3.5 text-xs text-gray-950 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Password
              </label>
              <div className="relative flex items-center bg-white border border-gray-200 rounded-xl focus-within:border-[#0B56D6] transition-colors">
                <Lock className="w-4 h-4 text-gray-400 absolute left-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent pl-11 pr-11 py-3.5 text-xs text-gray-950 placeholder-gray-400 tracking-wider focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex items-center justify-between text-xs font-bold pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-gray-200 rounded text-[#0B56D6] focus:ring-[#0B56D6]/20"
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={() => alert('Credentials recovery must be completed via the SuperAdmin console.')}
                className="text-[#0B56D6] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B56D6] hover:bg-[#0947B0] disabled:bg-gray-200 disabled:text-gray-400 text-white font-extrabold py-4 px-4 rounded-xl text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0B56D6]/10 mt-6"
            >
              {loading ? (
                'Signing In...'
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] font-bold text-gray-400 border-t border-gray-200/50 bg-[#F0F5FD]">
        <div>
          &copy; 2026 Sorella POS Systems. All rights reserved.
        </div>
        <div className="flex gap-4">
          <button onClick={() => alert('Privacy Policy')} className="hover:text-gray-700">Privacy Policy</button>
          <button onClick={() => alert('Terms of Service')} className="hover:text-gray-700">Terms of Service</button>
          <button onClick={() => alert('Security')} className="hover:text-gray-700">Security</button>
        </div>
      </footer>
    </div>
  );
};
export default LoginPage;
