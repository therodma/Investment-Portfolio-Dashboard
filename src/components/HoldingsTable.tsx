import React, { useState } from 'react';
import { Holding } from '../types';
import { Edit2, Trash2, ArrowUpDown, ExternalLink, Search, Plus, TrendingUp, TrendingDown } from 'lucide-react';

interface HoldingsTableProps {
  holdings: Holding[];
  onSelectStock: (ticker: string) => void;
  onEditHolding: (holding: Holding) => void;
  onDeleteHolding: (holdingId: string) => void;
  onOpenAddHolding: () => void;
}

type SortField = 'ticker' | 'totalValue' | 'totalGainLoss' | 'dailyGainLoss' | 'allocationPercent' | 'shares';

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  onSelectStock,
  onEditHolding,
  onDeleteHolding,
  onOpenAddHolding
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('totalValue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredHoldings = holdings.filter((h) =>
    h.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedHoldings = [...filteredHoldings].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      aVal = (aVal as string).toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-[#0f0f12] border border-white/5 rounded-2xl shadow-xl overflow-hidden mb-6 backdrop-blur-sm">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center space-x-2">
            <span>Portfolio Positions</span>
            <span className="text-xs bg-white/10 text-slate-300 font-mono px-2 py-0.5 rounded-full border border-white/10">
              {holdings.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400">Manage real-time equities, cost bases & performance metrics</p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {/* Quick Filter Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 rounded-full pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <button
            onClick={onOpenAddHolding}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1 shrink-0 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Position</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/5">
            <tr>
              <th className="py-3 px-4 font-semibold cursor-pointer hover:text-white" onClick={() => handleSort('ticker')}>
                <div className="flex items-center space-x-1">
                  <span>Asset / Holding</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort('shares')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Shares</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-right">Avg Cost / Price</th>
              <th className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort('totalValue')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Market Value</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort('dailyGainLoss')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Daily Gain/Loss</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort('totalGainLoss')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Total Gain/Loss</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white" onClick={() => handleSort('allocationPercent')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Weight</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {sortedHoldings.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 font-sans">
                  {holdings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3 py-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Plus className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200">Your Portfolio is Empty</h4>
                      <p className="text-xs text-slate-400">Start building your holdings by searching tickers or manually entering purchase details.</p>
                      <button
                        onClick={onOpenAddHolding}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                      >
                        Add Your First Stock
                      </button>
                    </div>
                  ) : (
                    "No holdings match your search query."
                  )}
                </td>
              </tr>
            ) : (
              sortedHoldings.map((h) => {
                const isTotalPositive = h.totalGainLoss >= 0;
                const isDailyPositive = h.dailyGainLoss >= 0;

                return (
                  <tr key={h.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Ticker & Company */}
                    <td className="py-3.5 px-4 font-sans">
                      <button
                        onClick={() => onSelectStock(h.ticker)}
                        className="text-left group-hover:text-blue-400 transition-colors flex items-center space-x-2 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold font-mono text-slate-200 group-hover:border-blue-500/50">
                          {h.ticker.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-slate-100 font-mono">{h.ticker}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${
                              h.assetType === 'etf' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {h.assetType}
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-[200px]">{h.companyName}</p>
                        </div>
                      </button>
                    </td>

                    {/* Shares */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-200">
                      {h.shares.toLocaleString()}
                    </td>

                    {/* Cost / Current Price */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="text-slate-200 font-bold">${h.currentPrice.toFixed(2)}</div>
                      <div className="text-[11px] text-slate-500">Avg: ${h.purchasePrice.toFixed(2)}</div>
                    </td>

                    {/* Total Market Value */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-100">
                      ${h.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Daily Gain/Loss */}
                    <td className={`py-3.5 px-4 text-right font-semibold ${isDailyPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <div>{isDailyPositive ? '+' : ''}${Math.abs(h.dailyGainLoss).toFixed(2)}</div>
                      <div className="text-[11px]">{isDailyPositive ? '+' : ''}{h.dailyGainLossPercent}%</div>
                    </td>

                    {/* Total Gain/Loss */}
                    <td className={`py-3.5 px-4 text-right font-semibold ${isTotalPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <div>{isTotalPositive ? '+' : ''}${Math.abs(h.totalGainLoss).toFixed(2)}</div>
                      <div className="text-[11px]">{isTotalPositive ? '+' : ''}{h.totalGainLossPercent}%</div>
                    </td>

                    {/* Portfolio Weight */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-300">
                      <div className="flex items-center justify-end space-x-1.5">
                        <div className="w-12 bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, h.allocationPercent)}%` }}></div>
                        </div>
                        <span>{h.allocationPercent}%</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center font-sans">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onEditHolding(h)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit position"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${h.ticker} from your portfolio?`)) {
                              onDeleteHolding(h.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete position"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
