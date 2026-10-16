import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, Lock, Mail, User as UserIcon, ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authMode, closeAuthModal, login, signup, resetPassword, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (authModalOpen) {
      setMode(authMode);
      setError(null);
      setSuccess(null);
    }
  }, [authModalOpen, authMode]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        if (!identifier.trim()) {
          setError('Please enter your username or email.');
          return;
        }
        if (!password) {
          setError('Please enter your password.');
          return;
        }
        await login(identifier.trim(), password);
      } else if (mode === 'signup') {
        if (!name.trim()) {
          setError('Please provide your name.');
          return;
        }
        if (!identifier.trim()) {
          setError('Please provide your email address.');
          return;
        }
        await signup(name.trim(), identifier.trim(), password);
      } else if (mode === 'reset') {
        if (!identifier.trim() || !password) {
          setError('Please enter your username/email and a new password.');
          return;
        }
        await resetPassword(identifier.trim(), password);
        setSuccess('Password updated successfully! Logging you in...');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setSuccess(null);
    try {
      await login('investor@example.com', 'password123');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    }
  };

  const handleOwnerPrefill = () => {
    setIdentifier('therodma');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              {mode === 'login' ? (
                <LogIn className="w-4 h-4" />
              ) : mode === 'signup' ? (
                <UserPlus className="w-4 h-4" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-base font-bold text-white">
              {mode === 'login'
                ? 'Log In to Portfolio Intelligence'
                : mode === 'signup'
                ? 'Create Investor Account'
                : 'Reset Password'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector (Hidden in Reset Mode) */}
        {mode !== 'reset' ? (
          <div className="flex border-b border-white/5 bg-[#0a0a0b]">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-white/[0.02]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-white/[0.02]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="px-5 py-2.5 border-b border-white/5 bg-[#0a0a0b] flex items-center justify-between">
            <span className="text-xs text-slate-400">Set a new password for your account</span>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccess(null);
              }}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Log In</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
              {success}
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan or Roderick Ma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                {mode === 'signup' ? 'Email Address' : 'Username or Email'}
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={handleOwnerPrefill}
                  className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Use @therodma
                </button>
              )}
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                autoComplete="username"
                placeholder={mode === 'signup' ? 'investor@example.com' : 'e.g. therodma or investor@example.com'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                required
              />
            </div>
            {mode === 'login' && (
              <p className="mt-1 text-[11px] text-slate-500">
                Supports username (<code className="text-slate-400">therodma</code>) or email address.
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                {mode === 'reset' ? 'New Password' : 'Password'}
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Forgot / Reset?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                autoComplete={mode === 'reset' ? 'new-password' : 'current-password'}
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
            {loading
              ? 'Processing...'
              : mode === 'login'
              ? 'Log In'
              : mode === 'signup'
              ? 'Create Account'
              : 'Reset Password & Log In'}
          </button>

          {/* Demo Login Button */}
          {mode !== 'reset' && (
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
          )}
        </form>
      </div>
    </div>
  );
};
