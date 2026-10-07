import React from 'react';
import { Portfolio } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Layers, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface MetricCardsProps {
  portfolio: Portfolio;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ portfolio }) => {
  const isTotalGainPositive = portfolio.totalGainLoss >= 0;
  const isDailyGainPositive = portfolio.dailyGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Portfolio Value */}
      <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-white/10 transition-all">
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400">Total Portfolio Value</span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
        <div className="mt-2 flex items-center space-x-2 text-[11px] text-slate-500">
          <span>Cost basis: ${portfolio.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Total Gain / Loss */}
      <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-white/10 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400">Total Gain / Loss</span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${
            isTotalGainPositive ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}>
            {isTotalGainPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isTotalGainPositive ? 'text-emerald-400' : 'text-rose-500'}`}>
            {isTotalGainPositive ? '+' : ''}${Math.abs(portfolio.totalGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
            isTotalGainPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isTotalGainPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {isTotalGainPositive ? '+' : ''}{portfolio.totalGainLossPercent}%
          </span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">All-time return since inception</p>
      </div>

      {/* Daily Gain / Loss */}
      <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-white/10 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400">Daily Gain / Loss</span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${
            isDailyGainPositive ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}>
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDailyGainPositive ? 'text-emerald-400' : 'text-rose-500'}`}>
            {isDailyGainPositive ? '+' : ''}${Math.abs(portfolio.dailyGainLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
            isDailyGainPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isDailyGainPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {isDailyGainPositive ? '+' : ''}{portfolio.dailyGainLossPercent}%
          </span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">Today's live market change</p>
      </div>

      {/* Number of Holdings */}
      <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl shadow-xl backdrop-blur-sm relative overflow-hidden group hover:border-white/10 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400">Active Positions</span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {portfolio.holdingsCount} <span className="text-sm font-normal text-slate-400">Assets</span>
          </h2>
        </div>
        <div className="mt-2 flex items-center space-x-2 text-[11px] text-slate-500">
          <span>{portfolio.holdings.filter((h) => h.assetType === 'stock').length} Stocks</span>
          <span>•</span>
          <span>{portfolio.holdings.filter((h) => h.assetType === 'etf').length} ETFs</span>
        </div>
      </div>
    </div>
  );
};
