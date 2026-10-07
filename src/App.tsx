import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Holding, Portfolio } from './types';
import { Navbar } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { PortfolioCharts } from './components/PortfolioCharts';
import { HoldingsTable } from './components/HoldingsTable';
import { AISummaryCard } from './components/AISummaryCard';
import { StockDetailsModal } from './components/StockDetailsModal';
import { AddHoldingModal } from './components/AddHoldingModal';
import { EditHoldingModal } from './components/EditHoldingModal';
import { StockSearchModal } from './components/StockSearchModal';
import { AuthModal } from './components/AuthModal';
import { RefreshCw, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

function MainDashboard() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [selectedStockTicker, setSelectedStockTicker] = useState<string | null>(null);
  const [addHoldingOpen, setAddHoldingOpen] = useState<boolean>(false);
  const [initialAddTicker, setInitialAddTicker] = useState<string>('');
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadPortfolio = async (fresh: boolean = false) => {
    if (fresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      if (portfolio?.id && fresh) {
        const freshPort = await api.getPortfolioById(portfolio.id, true);
        setPortfolio(freshPort);
      } else {
        const userPorts = await api.getPortfolios();
        if (userPorts && userPorts.length > 0) {
          setPortfolio(userPorts[0]);
        } else {
          setPortfolio(null);
        }
      }
    } catch (err: any) {
      console.error('Error loading portfolio:', err);
      setError('Failed to fetch portfolio data from backend.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, [user?.id]);

  const handleAddHolding = async (ticker: string, shares: number, purchasePrice: number) => {
    if (!portfolio) return;
    const updated = await api.addHolding(portfolio.id, ticker, shares, purchasePrice);
    setPortfolio(updated);
  };

  const handleUpdateHolding = async (holdingId: string, shares: number, purchasePrice: number) => {
    if (!portfolio) return;
    const updated = await api.updateHolding(portfolio.id, holdingId, shares, purchasePrice);
    setPortfolio(updated);
  };

  const handleDeleteHolding = async (holdingId: string) => {
    if (!portfolio) return;
    const updated = await api.deleteHolding(portfolio.id, holdingId);
    setPortfolio(updated);
  };

  const openAddWithTicker = (ticker: string) => {
    setInitialAddTicker(ticker);
    setAddHoldingOpen(true);
  };

  const scrollToAISummary = () => {
    const el = document.getElementById('ai-summary-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenAddHolding={() => { setInitialAddTicker(''); setAddHoldingOpen(true); }}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAI={scrollToAISummary}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 font-medium">Fetching portfolio intelligence & market data...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-center text-rose-400 space-y-2 my-8">
            <AlertCircle className="w-8 h-8 mx-auto text-rose-400" />
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={loadPortfolio}
              className="px-4 py-2 bg-white/5 border border-white/10 text-slate-200 rounded-xl text-xs hover:bg-white/10 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : portfolio ? (
          <div>
            {/* Dashboard Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-white">{portfolio.name}</h1>
                  <button
                    onClick={() => loadPortfolio(true)}
                    disabled={refreshing}
                    className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    title="Refresh market prices"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time market valuation • Updated {new Date(portfolio.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Feature 3: Metric Summary Cards */}
            <MetricCards portfolio={portfolio} />

            {/* Feature 5: AI Portfolio Summary */}
            <AISummaryCard portfolio={portfolio} />

            {/* Feature 3: Visual Charts (Allocation, Sector, Value Over Time) */}
            <PortfolioCharts portfolio={portfolio} />

            {/* Feature 2: Portfolio Holdings Table */}
            <HoldingsTable
              holdings={portfolio.holdings}
              onSelectStock={(t) => setSelectedStockTicker(t)}
              onEditHolding={(h) => setEditingHolding(h)}
              onDeleteHolding={handleDeleteHolding}
              onOpenAddHolding={() => { setInitialAddTicker(''); setAddHoldingOpen(true); }}
            />
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">No Portfolio Found</h2>
            <p className="text-xs text-slate-400">Create your first portfolio holding to unlock analytics.</p>
            <button
              onClick={() => { setInitialAddTicker(''); setAddHoldingOpen(true); }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-xs"
            >
              Add First Position
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0a0b]/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Portfolio Intelligence Dashboard • Powered by Gemini AI</span>
          <span>Educational & Analytics Tool • Not Financial Advice</span>
        </div>
      </footer>

      {/* Modals */}
      {/* Stock Details Modal */}
      <StockDetailsModal
        ticker={selectedStockTicker}
        onClose={() => setSelectedStockTicker(null)}
        onOpenAddHoldingWithTicker={openAddWithTicker}
      />

      {/* Add Holding Modal */}
      {addHoldingOpen && portfolio && (
        <AddHoldingModal
          portfolioId={portfolio.id}
          initialTicker={initialAddTicker}
          onClose={() => setAddHoldingOpen(false)}
          onSubmit={handleAddHolding}
        />
      )}

      {/* Edit Holding Modal */}
      {editingHolding && portfolio && (
        <EditHoldingModal
          holding={editingHolding}
          onClose={() => setEditingHolding(null)}
          onSubmit={handleUpdateHolding}
        />
      )}

      {/* Stock Search Overlay Modal */}
      {searchModalOpen && (
        <StockSearchModal
          onClose={() => setSearchModalOpen(false)}
          onSelectStock={(t) => setSelectedStockTicker(t)}
          onOpenAddHoldingWithTicker={openAddWithTicker}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainDashboard />
    </AuthProvider>
  );
}
