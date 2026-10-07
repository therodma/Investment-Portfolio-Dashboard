import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { StockDetail } from '../types';
import { Search, X, Plus, ExternalLink, TrendingUp, TrendingDown, Building2 } from 'lucide-react';

interface StockSearchModalProps {
  onClose: () => void;
  onSelectStock: (ticker: string) => void;
  onOpenAddHoldingWithTicker: (ticker: string) => void;
}

export const StockSearchModal: React.FC<StockSearchModalProps> = ({
  onClose,
  onSelectStock,
  onOpenAddHoldingWithTicker
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);
      try {
        const data = await api.searchStocks(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      handleSearch();
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-md flex items-start justify-center pt-16 px-4">
      <div className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="p-4 border-b border-white/5 flex items-center space-x-3 bg-[#0a0a0b]">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            placeholder="Search any market ticker or company (e.g. AAPL, NVDA, PLTR, NFLX, DIS)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none font-mono"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/5">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
              <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
              <span>Searching live market quotes...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-xs text-slate-400">
                No matching cached stocks for <span className="text-white font-mono font-bold">"{query}"</span>.
              </p>
              {query.trim() && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddHoldingWithTicker(query.trim().toUpperCase());
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add {query.trim().toUpperCase()} from Entire Market</span>
                </button>
              )}
            </div>
          ) : (
            results.map((stock) => {
              const isPositive = stock.changeDay >= 0;

              return (
                <div
                  key={stock.ticker}
                  className="p-4 hover:bg-white/[0.03] transition-colors flex items-center justify-between group"
                >
                  <button
                    onClick={() => {
                      onClose();
                      onSelectStock(stock.ticker);
                    }}
                    className="flex items-center space-x-3 text-left flex-1 cursor-pointer pr-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold font-mono text-slate-200 group-hover:border-blue-500/50">
                      {stock.ticker.substring(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-100 font-mono text-sm">{stock.ticker}</span>
                        <span className="text-[10px] bg-white/5 text-slate-400 px-1.5 py-0.2 rounded border border-white/10 uppercase">
                          {stock.assetType}
                        </span>
                        <span className="text-[11px] text-slate-400 font-sans">{stock.sector}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans">{stock.name}</p>
                    </div>
                  </button>

                  <div className="flex items-center space-x-4">
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-white">${stock.price.toFixed(2)}</div>
                      <div className={`text-[11px] font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : ''}{stock.changeDayPercent}%
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenAddHoldingWithTicker(stock.ticker);
                      }}
                      className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 font-semibold px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1 transition-all cursor-pointer"
                      title="Add to portfolio"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
