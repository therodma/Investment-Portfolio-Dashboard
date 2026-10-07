import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AISummaryResponse, Portfolio } from '../types';
import { Sparkles, RefreshCw, AlertTriangle, ShieldCheck, PieChart, Info, CheckCircle2 } from 'lucide-react';

interface AISummaryCardProps {
  portfolio: Portfolio;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({ portfolio }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [aiData, setAiData] = useState<AISummaryResponse | null>(null);
  const [activeFocus, setActiveFocus] = useState<'general' | 'diversification' | 'risk' | 'dividends'>('general');

  const fetchSummary = async (focusType: 'general' | 'diversification' | 'risk' | 'dividends' = activeFocus) => {
    setLoading(true);
    try {
      const data = await api.getAISummary(portfolio.id, focusType);
      setAiData(data);
    } catch (err) {
      console.error('Error fetching AI summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (portfolio && portfolio.holdings.length > 0) {
      fetchSummary('general');
    }
  }, [portfolio.id, portfolio.holdings.length]);

  const handleFocusChange = (focus: 'general' | 'diversification' | 'risk' | 'dividends') => {
    setActiveFocus(focus);
    fetchSummary(focus);
  };

  return (
    <div id="ai-summary-section" className="bg-gradient-to-br from-blue-950/30 via-[#0f0f12] to-[#0a0a0b] border border-blue-500/20 rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden backdrop-blur-sm">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white tracking-tight">AI Portfolio Intelligence</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">Plain-English portfolio synthesis & risk analytics</p>
          </div>
        </div>

        {/* Focus Selector Buttons & Refresh */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fetchSummary()}
            disabled={loading || portfolio.holdings.length === 0}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Refresh AI analysis"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Focus Pill Bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: 'general', label: 'General Summary' },
          { id: 'diversification', label: 'Diversification' },
          { id: 'risk', label: 'Risk Analysis' },
          { id: 'dividends', label: 'Income & Yield' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleFocusChange(item.id as any)}
            disabled={portfolio.holdings.length === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer disabled:opacity-50 ${
              activeFocus === item.id
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content & Indicators */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-blue-400 font-medium animate-pulse">Analyzing portfolio metrics with Gemini AI...</p>
        </div>
      ) : aiData && portfolio.holdings.length > 0 ? (
        <div className="space-y-5">
          {/* Key Metric Indicators Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Diversification Score</p>
                <p className="text-sm font-bold text-white font-mono">{aiData.diversificationScore} / 100</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 border-t sm:border-t-0 sm:border-l border-white/5 pt-2 sm:pt-0 sm:pl-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                aiData.riskLevel === 'High' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Portfolio Risk Level</p>
                <p className={`text-sm font-bold font-mono ${aiData.riskLevel === 'High' ? 'text-amber-400' : 'text-blue-400'}`}>
                  {aiData.riskLevel}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 border-t sm:border-t-0 sm:border-l border-white/5 pt-2 sm:pt-0 sm:pl-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Top Concentration</p>
                <p className="text-sm font-bold text-white font-mono">
                  {aiData.topConcentration.ticker} ({aiData.topConcentration.percentage}%)
                </p>
              </div>
            </div>
          </div>

          {/* AI Narrative Summary */}
          <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              "{aiData.summary}"
            </p>
          </div>

          {/* Bullet Key Takeaways */}
          {aiData.keyPoints && aiData.keyPoints.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Takeaways</h4>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {aiData.keyPoints.map((pt, i) => (
                  <li key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-xs text-slate-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-slate-400 text-xs bg-white/[0.02] border border-white/5 rounded-xl">
          Add stock positions to generate real-time AI investment intelligence and risk analytics.
        </div>
      )}
    </div>
  );
};
