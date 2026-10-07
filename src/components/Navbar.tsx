import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Plus, Search, TrendingUp, LogOut, User as UserIcon, LogIn, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAddHolding: () => void;
  onOpenSearch: () => void;
  onOpenAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddHolding, onOpenSearch, onOpenAI }) => {
  const { user, logout, openAuthModal } = useAuth();

  return (
    <header className="bg-[#0a0a0b]/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrendingUp className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-white">
                Intelligence
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Portfolio Analytics & Intelligence</p>
          </div>
        </div>

        {/* Global Stock Search Trigger */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-slate-400 px-4 py-2 rounded-full text-xs flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="text-slate-400">Search ticker (e.g. AAPL, NVDA, SPY)...</span>
            </div>
            <kbd className="hidden lg:inline-block bg-white/10 text-slate-400 px-1.5 py-0.5 rounded text-[10px] border border-white/10">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions & User Profile */}
        <div className="flex items-center space-x-3">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl md:hidden"
            title="Search Stocks"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* AI Insights Quick Jump */}
          <button
            onClick={onOpenAI}
            className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">AI Insights</span>
          </button>

          {/* Add Holding Button */}
          <button
            onClick={onOpenAddHolding}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-blue-600/25 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Position</span>
          </button>

          {/* User Auth Menu */}
          {user ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
              <div className="hidden lg:flex flex-col items-end">
                <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                <p className="text-[10px] text-emerald-400 font-medium">Verified Investor</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
