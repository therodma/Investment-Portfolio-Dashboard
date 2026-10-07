import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StockDetail } from '../types';
import { X, Plus, CheckCircle, Loader2 } from 'lucide-react';

interface AddHoldingModalProps {
  portfolioId: string;
  initialTicker?: string;
  onClose: () => void;
  onSubmit: (ticker: string, shares: number, purchasePrice: number) => Promise<void>;
}

export const AddHoldingModal: React.FC<AddHoldingModalProps> = ({
  portfolioId,
  initialTicker = '',
  onClose,
  onSubmit
}) => {
  const [ticker, setTicker] = useState(initialTicker);
  const [shares, setShares] = useState<string>('10');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [stockDetail, setStockDetail] = useState<StockDetail | null>(null);
  const [fetchingStock, setFetchingStock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch live market stock quote whenever ticker changes
  useEffect(() => {
    const symbol = ticker.trim().toUpperCase();
    if (!symbol) {
      setStockDetail(null);
      return;
    }

    const timer = setTimeout(async () => {
      setFetchingStock(true);
      try {
        const detail = await api.getStockDetail(symbol);
        setStockDetail(detail);
        // Pre-fill purchase price if empty
        if (detail && !purchasePrice) {
          setPurchasePrice(detail.price.toString());
        }
      } catch (err) {
        setStockDetail(null);
      } finally {
        setFetchingStock(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [ticker]);

  const handleTickerChange = (val: string) => {
    setTicker(val.toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const sNum = parseFloat(shares);
    const pNum = parseFloat(purchasePrice || (stockDetail ? stockDetail.price.toString() : '0'));

    if (!ticker.trim()) {
      setError('Please enter a valid stock or ETF ticker.');
      return;
    }
    if (isNaN(sNum) || sNum <= 0) {
      setError('Number of shares must be greater than 0.');
      return;
    }
    if (isNaN(pNum) || pNum <= 0) {
      setError('Purchase price per share must be greater than 0.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(ticker.toUpperCase(), sNum, pNum);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add holding');
    } finally {
      setLoading(false);
    }
  };

  const quickTickers = ['AAPL', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'SPY', 'QQQ', 'VOO', 'JPM', 'TSLA'];

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Add Holding to Portfolio</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
              {error}
            </div>
          )}

          {/* Quick Popular Ticker Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Popular Tickers</label>
            <div className="flex flex-wrap gap-1.5">
              {quickTickers.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => handleTickerChange(t)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono font-semibold border transition-all cursor-pointer ${
                    ticker === t
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Ticker Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                Stock / ETF Ticker <span className="text-blue-400">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Entire Market Supported (e.g. DIS, NFLX, PLTR)</span>
            </div>
            <input
              type="text"
              placeholder="e.g. AAPL, NVDA, PLTR, NFLX, DIS"
              value={ticker}
              onChange={(e) => handleTickerChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-600 outline-none uppercase transition-colors"
              required
            />
            {fetchingStock ? (
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center space-x-1.5 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                <span>Pulling live price from market...</span>
              </p>
            ) : stockDetail ? (
              <div className="text-[11px] text-emerald-400 mt-1.5 flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium text-white">{stockDetail.name} ({stockDetail.ticker})</span>
                <span className="font-mono font-bold text-emerald-400">${stockDetail.price.toFixed(2)}</span>
                <span className="text-slate-400">({stockDetail.sector})</span>
              </div>
            ) : ticker.trim().length > 0 ? (
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                Enter ticker symbol to pull live market quote.
              </p>
            ) : null}
          </div>

          {/* Shares Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Number of Shares <span className="text-blue-400">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0.0001"
              placeholder="e.g. 10"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-600 outline-none transition-colors"
              required
            />
          </div>

          {/* Purchase Price Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Purchase Price ($ per share) <span className="text-blue-400">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              placeholder={stockDetail ? `Current market quote: $${stockDetail.price}` : 'e.g. 185.50'}
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-600 outline-none transition-colors"
              required
            />
          </div>

          {/* Form Submit Buttons */}
          <div className="pt-2 flex items-center space-x-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Position'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
