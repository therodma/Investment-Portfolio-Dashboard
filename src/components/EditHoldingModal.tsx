import React, { useState } from 'react';
import { Holding } from '../types';
import { X, Edit2 } from 'lucide-react';

interface EditHoldingModalProps {
  holding: Holding;
  onClose: () => void;
  onSubmit: (holdingId: string, shares: number, purchasePrice: number) => Promise<void>;
}

export const EditHoldingModal: React.FC<EditHoldingModalProps> = ({
  holding,
  onClose,
  onSubmit
}) => {
  const [shares, setShares] = useState<string>(holding.shares.toString());
  const [purchasePrice, setPurchasePrice] = useState<string>(holding.purchasePrice.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const sNum = parseFloat(shares);
    const pNum = parseFloat(purchasePrice);

    if (isNaN(sNum) || sNum <= 0) {
      setError('Shares must be greater than 0');
      return;
    }
    if (isNaN(pNum) || pNum <= 0) {
      setError('Purchase price must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(holding.id, sNum, pNum);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update holding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit {holding.ticker} Position</h3>
              <p className="text-[11px] text-slate-400">{holding.companyName}</p>
            </div>
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

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Number of Shares
            </label>
            <input
              type="number"
              step="any"
              min="0.0001"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-sm text-white font-mono outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Avg Purchase Price ($ per share)
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-2 text-sm text-white font-mono outline-none transition-colors"
              required
            />
          </div>

          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 text-xs text-slate-400 flex justify-between">
            <span>Current Price: <strong className="text-white font-mono">${holding.currentPrice.toFixed(2)}</strong></span>
            <span>New Value: <strong className="text-blue-400 font-mono">${((parseFloat(shares) || 0) * holding.currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></span>
          </div>

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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
