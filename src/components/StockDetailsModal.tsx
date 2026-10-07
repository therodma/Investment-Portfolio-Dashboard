import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { StockDetail } from '../types';
import { X, TrendingUp, TrendingDown, DollarSign, PieChart, Info, Plus, BarChart2, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StockDetailsModalProps {
  ticker: string | null;
  onClose: () => void;
  onOpenAddHoldingWithTicker: (ticker: string) => void;
}

export const StockDetailsModal: React.FC<StockDetailsModalProps> = ({
  ticker,
  onClose,
  onOpenAddHoldingWithTicker
}) => {
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = (fresh = false) => {
    if (!ticker) return;
    if (fresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    api.getStockDetail(ticker, fresh)
      .then((s) => setStock(s))
      .catch((err) => setError(err.message || 'Failed to fetch stock information.'))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (ticker) {
      fetchDetails(false);
    } else {
      setStock(null);
    }
  }, [ticker]);

  if (!ticker) return null;

  // Format market cap
  const formatMarketCap = (mc: number) => {
    if (mc >= 1000000000000) return `$${(mc / 1000000000000).toFixed(2)} Trillion`;
    if (mc >= 1000000000) return `$${(mc / 1000000000).toFixed(2)} Billion`;
    return `$${(mc / 1000000).toFixed(2)} Million`;
  };

  const isPositive = stock ? stock.changeDay >= 0 : true;

  // Calculate position in 52 week range
  const calculate52WRangePercent = () => {
    if (!stock) return 50;
    const range = stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow;
    if (range <= 0) return 50;
    const pos = stock.price - stock.fiftyTwoWeekLow;
    return Math.max(0, Math.min(100, (pos / range) * 100));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0f0f12] z-10 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold font-mono text-blue-400">
              {ticker.substring(0, 3)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white font-mono">{stock ? stock.ticker : ticker}</h3>
                {stock && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/10 rounded-md">
                    {stock.assetType.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{stock ? stock.name : 'Loading...'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchDetails(true)}
              disabled={refreshing || loading}
              title="Refresh live market price"
              className="p-2 text-slate-400 hover:text-blue-400 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Loading stock fundamental details...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400 text-sm">{error}</div>
        ) : stock ? (
          <div className="p-6 space-y-6">
            {/* Price Banner */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between bg-white/[0.02] border border-white/5 p-4 rounded-xl">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Current Stock Price</span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-extrabold text-white font-mono">${stock.price.toFixed(2)}</span>
                  <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md ${
                    isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {isPositive ? '+' : ''}${stock.changeDay.toFixed(2)} ({isPositive ? '+' : ''}{stock.changeDayPercent}%)
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenAddHoldingWithTicker(stock.ticker);
                }}
                className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add to Portfolio</span>
              </button>
            </div>

            {/* Historical Price Chart */}
            {stock.historicalPrices && stock.historicalPrices.length > 0 && (
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Price Trend</span>
                  <span>Historical Movement</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stock.historicalPrices}>
                      <defs>
                        <linearGradient id="stockChart" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0a0a0b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', fontSize: '12px' }}
                        formatter={(val: number) => [`$${val.toFixed(2)}`, 'Price']}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke={isPositive ? '#10b981' : '#f43f5e'}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#stockChart)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Required Fundamentals Grid (Market Cap, P/E Ratio, Dividend Yield, 52-Wk High/Low) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Market Cap</span>
                <span className="text-sm font-bold text-white font-mono">{formatMarketCap(stock.marketCap)}</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">P/E Ratio</span>
                <span className="text-sm font-bold text-white font-mono">
                  {stock.peRatio !== null ? stock.peRatio : 'N/A'}
                </span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Dividend Yield</span>
                <span className="text-sm font-bold text-blue-400 font-mono">
                  {stock.dividendYield > 0 ? `${stock.dividendYield}%` : '0.00%'}
                </span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Sector</span>
                <span className="text-sm font-bold text-slate-200 truncate block">{stock.sector}</span>
              </div>
            </div>

            {/* 52-Week High / Low Range Indicator */}
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">52-Week Low: <strong className="text-white font-mono">${stock.fiftyTwoWeekLow.toFixed(2)}</strong></span>
                <span className="text-slate-400 font-semibold">52-Week Price Range</span>
                <span className="text-slate-400">52-Week High: <strong className="text-white font-mono">${stock.fiftyTwoWeekHigh.toFixed(2)}</strong></span>
              </div>
              <div className="relative w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                  style={{ width: `${calculate52WRangePercent()}%` }}
                ></div>
              </div>
            </div>

            {/* Company Overview Description */}
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-1">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Company Overview</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{stock.description}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
