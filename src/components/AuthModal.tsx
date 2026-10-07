import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, Lock, Mail, User as UserIcon, ShieldCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authMode, closeAuthModal, login, signup, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(authMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) {
          setError('Please provide your name.');
          return;
        }
        await signup(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    try {
      await login('investor@example.com', 'password123');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <h3 className="text-base font-bold text-white">
              {mode === 'login' ? 'Log In to Portfolio Intelligence' : 'Create Investor Account'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/5 bg-[#0a0a0b]">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'login' ? 'text-blue-400 border-b-2 border-blue-500 bg-white/[0.02]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'signup' ? 'text-blue-400 border-b-2 border-blue-500 bg-white/[0.02]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="investor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>

          {/* Demo Login Button */}
          <div className="pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-medium py-2 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Log In as Demo Investor (Alex Morgan)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
