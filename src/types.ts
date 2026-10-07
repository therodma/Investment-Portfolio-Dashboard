export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Holding {
  id: string;
  portfolioId: string;
  ticker: string;
  companyName: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  sector: string;
  assetType: 'stock' | 'etf';
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dailyGainLoss: number;
  dailyGainLossPercent: number;
  allocationPercent: number;
  addedAt: string;
}

export interface StockDetail {
  ticker: string;
  name: string;
  sector: string;
  assetType: 'stock' | 'etf';
  price: number;
  changeDay: number;
  changeDayPercent: number;
  marketCap: number; // in billions/trillions
  peRatio: number | null;
  dividendYield: number; // percent
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  description: string;
  avgVolume: string;
  historicalPrices: { date: string; price: number }[];
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  holdings: Holding[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dailyGainLoss: number;
  dailyGainLossPercent: number;
  holdingsCount: number;
  updatedAt: string;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PortfolioAllocation {
  ticker: string;
  companyName: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ValueHistoryPoint {
  date: string;
  value: number;
  cost: number;
}

export interface AISummaryRequest {
  portfolioId: string;
  focus?: 'general' | 'diversification' | 'risk' | 'dividends';
}

export interface AISummaryResponse {
  summary: string;
  keyPoints: string[];
  diversificationScore: number; // 0 - 100
  riskLevel: 'Low' | 'Moderate' | 'High';
  topConcentration: { ticker: string; percentage: number };
  generatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
