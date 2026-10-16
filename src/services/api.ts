import { AISummaryResponse, AuthResponse, Holding, Portfolio, StockDetail, User } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('portfolio_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth Services
  async signup(name: string, email: string, pass: string, profile?: Partial<User>): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass, ...profile })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Signup failed');
    }
    return res.json();
  },

  async login(identifier: string, pass: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, email: identifier, password: pass })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async resetPassword(identifier: string, newPassword: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, newPassword })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Password reset failed');
    }
    return res.json();
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader()
    });
    if (!res.ok) {
      throw new Error('Not authenticated');
    }
    const data = await res.json();
    return data.user;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    }
    const data = await res.json();
    return data.user;
  },

  // Portfolio Services
  async getPortfolios(): Promise<Portfolio[]> {
    const res = await fetch(`${API_BASE}/portfolios`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch portfolios');
    return res.json();
  },

  async getPortfolioById(id: string, fresh: boolean = false): Promise<Portfolio> {
    const query = fresh ? '?fresh=true' : '';
    const res = await fetch(`${API_BASE}/portfolios/${id}${query}`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch portfolio');
    return res.json();
  },

  async addHolding(portfolioId: string, ticker: string, shares: number, purchasePrice: number): Promise<Portfolio> {
    const res = await fetch(`${API_BASE}/portfolios/${portfolioId}/holdings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ ticker, shares, purchasePrice })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add holding');
    }
    return res.json();
  },

  async updateHolding(portfolioId: string, holdingId: string, shares: number, purchasePrice: number): Promise<Portfolio> {
    const res = await fetch(`${API_BASE}/portfolios/${portfolioId}/holdings/${holdingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ shares, purchasePrice })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update holding');
    }
    return res.json();
  },

  async deleteHolding(portfolioId: string, holdingId: string): Promise<Portfolio> {
    const res = await fetch(`${API_BASE}/portfolios/${portfolioId}/holdings/${holdingId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete holding');
    }
    return res.json();
  },

  // Stock Market Services
  async searchStocks(query: string): Promise<StockDetail[]> {
    const res = await fetch(`${API_BASE}/stocks/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  async getStockDetail(ticker: string, fresh: boolean = false): Promise<StockDetail> {
    const query = fresh ? '?fresh=true' : '';
    const res = await fetch(`${API_BASE}/stocks/${encodeURIComponent(ticker)}${query}`);
    if (!res.ok) throw new Error('Failed to get stock detail');
    return res.json();
  },

  // AI Summary Service
  async getAISummary(portfolioId: string, focus: string = 'general'): Promise<AISummaryResponse> {
    const res = await fetch(`${API_BASE}/ai/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ portfolioId, focus })
    });
    if (!res.ok) throw new Error('Failed to generate AI summary');
    return res.json();
  }
};
