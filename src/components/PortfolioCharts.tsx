import React, { useState } from 'react';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Portfolio } from '../types';
import { PieChart as PieIcon, BarChart3, TrendingUp, Calendar } from 'lucide-react';

interface PortfolioChartsProps {
  portfolio: Portfolio;
}

const STOCK_COLORS = [
  '#2563eb', '#3b82f6', '#6366f1', '#8b5cf6',
  '#ec4899', '#06b6d4', '#10b981', '#f59e0b'
];

const SECTOR_COLORS: Record<string, string> = {
  Technology: '#2563eb',
  'Broad Market ETF': '#3b82f6',
  'Tech Growth ETF': '#6366f1',
  Financials: '#f59e0b',
  Healthcare: '#06b6d4',
  'Consumer Cyclical': '#ec4899',
  'Consumer Staples': '#10b981',
  Energy: '#ef4444',
  Other: '#64748b'
};

export const PortfolioCharts: React.FC<PortfolioChartsProps> = ({ portfolio }) => {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M');

  if (!portfolio.holdings || portfolio.holdings.length === 0) {
    return (
      <div className="bg-[#0f0f12] border border-white/5 rounded-2xl p-8 mb-6 text-center text-slate-400 shadow-xl backdrop-blur-sm">
        <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-3">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">Interactive Portfolio Charts</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Add your first asset holding to start tracking real-time performance curves, asset weights, and sector allocation breakdowns.
        </p>
      </div>
    );
  }

  // Prepare allocation chart data
  const allocationData = portfolio.holdings.map((h, i) => ({
    name: h.ticker,
    fullName: h.companyName,
    value: h.totalValue,
    percentage: h.allocationPercent,
    color: STOCK_COLORS[i % STOCK_COLORS.length]
  }));

  // Prepare sector allocation data
  const sectorMap: Record<string, number> = {};
  portfolio.holdings.forEach((h) => {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.totalValue;
  });

  const sectorData = Object.entries(sectorMap).map(([sector, val]) => ({
    name: sector,
    value: val,
    percentage: portfolio.totalValue > 0 ? Number(((val / portfolio.totalValue) * 100).toFixed(1)) : 0,
    color: SECTOR_COLORS[sector] || '#64748b'
  })).sort((a, b) => b.value - a.value);

  // Historical portfolio performance timeline simulation based on holdings
  const generateTimeline = () => {
    const baseValue = portfolio.totalValue;
    const baseCost = portfolio.totalCost;

    if (timeframe === '1M') {
      return [
        { date: '4 Wks Ago', value: Number((baseValue * 0.96).toFixed(2)), cost: baseCost },
        { date: '3 Wks Ago', value: Number((baseValue * 0.98).toFixed(2)), cost: baseCost },
        { date: '2 Wks Ago', value: Number((baseValue * 0.975).toFixed(2)), cost: baseCost },
        { date: '1 Wk Ago', value: Number((baseValue * 0.992).toFixed(2)), cost: baseCost },
        { date: 'Today', value: baseValue, cost: baseCost }
      ];
    } else if (timeframe === '3M') {
      return [
        { date: '3 Mos Ago', value: Number((baseValue * 0.91).toFixed(2)), cost: baseCost },
        { date: '2 Mos Ago', value: Number((baseValue * 0.94).toFixed(2)), cost: baseCost },
        { date: '1 Mo Ago', value: Number((baseValue * 0.97).toFixed(2)), cost: baseCost },
        { date: 'Today', value: baseValue, cost: baseCost }
      ];
    } else if (timeframe === '6M') {
      return [
        { date: 'Feb', value: Number((baseValue * 0.82).toFixed(2)), cost: Number((baseCost * 0.92).toFixed(2)) },
        { date: 'Mar', value: Number((baseValue * 0.86).toFixed(2)), cost: Number((baseCost * 0.94).toFixed(2)) },
        { date: 'Apr', value: Number((baseValue * 0.84).toFixed(2)), cost: Number((baseCost * 0.95).toFixed(2)) },
        { date: 'May', value: Number((baseValue * 0.91).toFixed(2)), cost: Number((baseCost * 0.97).toFixed(2)) },
        { date: 'Jun', value: Number((baseValue * 0.96).toFixed(2)), cost: baseCost },
        { date: 'Jul', value: Number((baseValue * 0.98).toFixed(2)), cost: baseCost },
        { date: 'Aug', value: baseValue, cost: baseCost }
      ];
    } else {
      return [
        { date: '2023 Q3', value: Number((baseValue * 0.72).toFixed(2)), cost: Number((baseCost * 0.80).toFixed(2)) },
        { date: '2023 Q4', value: Number((baseValue * 0.78).toFixed(2)), cost: Number((baseCost * 0.85).toFixed(2)) },
        { date: '2024 Q1', value: Number((baseValue * 0.86).toFixed(2)), cost: Number((baseCost * 0.92).toFixed(2)) },
        { date: '2024 Q2', value: Number((baseValue * 0.94).toFixed(2)), cost: baseCost },
        { date: 'Current', value: baseValue, cost: baseCost }
      ];
    }
  };

  const timelineData = generateTimeline();

  // Custom tooltips
  const CustomValueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0a0b] border border-white/10 p-3 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-slate-300 mb-1">{label}</p>
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
            <span>Portfolio Value:</span>
            <span>${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          {payload[1] && (
            <div className="flex items-center space-x-2 text-slate-400 mt-0.5">
              <span>Cost Basis:</span>
              <span>${payload[1].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0a0a0b] border border-white/10 p-3 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-white">{data.fullName || data.name}</p>
          <p className="text-blue-400 font-bold mt-1">
            ${data.value.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* 1. Portfolio Value Over Time (Main Area Chart - Spans 2 cols on lg) */}
      <div className="lg:col-span-2 bg-[#0f0f12] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Portfolio Value Over Time</h3>
              <p className="text-xs text-slate-400">Historical performance vs investment cost basis</p>
            </div>
          </div>

          {/* Timeframe Selector Tabs */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomValueTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                name="Portfolio Value"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
              <Area
                type="monotone"
                dataKey="cost"
                name="Cost Basis"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorCost)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Portfolio Allocation (Pie / Donut Chart) */}
      <div className="bg-[#0f0f12] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-xl backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Stock Allocation</h3>
            <p className="text-xs text-slate-400">Weight by total asset value</p>
          </div>
        </div>

        <div className="h-48 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f0f12" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend Chips */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-white/5 max-h-24 overflow-y-auto">
          {allocationData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 truncate pr-1">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-200 font-medium truncate">{item.name}</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Sector Allocation (Bar Chart Breakdown - Spans 3 cols on lg) */}
      <div className="lg:col-span-3 bg-[#0f0f12] border border-white/5 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Sector Allocation</h3>
              <p className="text-xs text-slate-400">Industry & asset class diversification</p>
            </div>
          </div>
        </div>

        {/* Custom Visual Bar Rows */}
        <div className="space-y-3">
          {sectorData.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-200 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400 font-mono">${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span className="text-blue-400 font-bold font-mono w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
