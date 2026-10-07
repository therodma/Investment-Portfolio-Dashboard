import { Holding, Portfolio, StockDetail, User } from '../src/types.js';
import { fetchLiveMarketStock } from './stockFetcher.js';

// Pre-populated market tickers database with detailed financial metrics
export const MARKET_STOCKS: Record<string, StockDetail> = {
  AAPL: {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    assetType: 'stock',
    price: 228.45,
    changeDay: 3.12,
    changeDayPercent: 1.38,
    marketCap: 3480000000000,
    peRatio: 33.4,
    dividendYield: 0.44,
    fiftyTwoWeekHigh: 237.23,
    fiftyTwoWeekLow: 164.08,
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services.',
    avgVolume: '48.2M',
    historicalPrices: [
      { date: '6M ago', price: 180.20 },
      { date: '5M ago', price: 188.50 },
      { date: '4M ago', price: 195.10 },
      { date: '3M ago', price: 210.30 },
      { date: '2M ago', price: 222.80 },
      { date: '1M ago', price: 224.10 },
      { date: 'Today', price: 228.45 },
    ]
  },
  NVDA: {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    assetType: 'stock',
    price: 124.60,
    changeDay: 4.85,
    changeDayPercent: 4.05,
    marketCap: 3060000000000,
    peRatio: 64.2,
    dividendYield: 0.03,
    fiftyTwoWeekHigh: 140.76,
    fiftyTwoWeekLow: 45.42,
    description: 'NVIDIA Corporation is a pioneer in GPU-accelerated computing, AI chipsets, data center architectures, and autonomous vehicles.',
    avgVolume: '62.5M',
    historicalPrices: [
      { date: '6M ago', price: 68.40 },
      { date: '5M ago', price: 82.10 },
      { date: '4M ago', price: 91.50 },
      { date: '3M ago', price: 115.00 },
      { date: '2M ago', price: 128.20 },
      { date: '1M ago', price: 118.90 },
      { date: 'Today', price: 124.60 },
    ]
  },
  MSFT: {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    assetType: 'stock',
    price: 432.10,
    changeDay: -1.45,
    changeDayPercent: -0.33,
    marketCap: 3210000000000,
    peRatio: 35.8,
    dividendYield: 0.69,
    fiftyTwoWeekHigh: 468.35,
    fiftyTwoWeekLow: 327.00,
    description: 'Microsoft develops software, hardware, services, and cloud solutions including Azure, Windows, Microsoft 365, and AI Copilot platform.',
    avgVolume: '21.4M',
    historicalPrices: [
      { date: '6M ago', price: 405.00 },
      { date: '5M ago', price: 415.20 },
      { date: '4M ago', price: 425.60 },
      { date: '3M ago', price: 448.90 },
      { date: '2M ago', price: 442.10 },
      { date: '1M ago', price: 436.00 },
      { date: 'Today', price: 432.10 },
    ]
  },
  AMZN: {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Cyclical',
    assetType: 'stock',
    price: 178.90,
    changeDay: 2.15,
    changeDayPercent: 1.22,
    marketCap: 1860000000000,
    peRatio: 41.5,
    dividendYield: 0.00,
    fiftyTwoWeekHigh: 201.20,
    fiftyTwoWeekLow: 118.35,
    description: 'Amazon focuses on e-commerce, cloud computing (AWS), digital streaming, online advertising, and artificial intelligence.',
    avgVolume: '35.8M',
    historicalPrices: [
      { date: '6M ago', price: 170.00 },
      { date: '5M ago', price: 175.40 },
      { date: '4M ago', price: 184.20 },
      { date: '3M ago', price: 193.50 },
      { date: '2M ago', price: 186.10 },
      { date: '1M ago', price: 174.20 },
      { date: 'Today', price: 178.90 },
    ]
  },
  GOOGL: {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    assetType: 'stock',
    price: 168.30,
    changeDay: -0.85,
    changeDayPercent: -0.50,
    marketCap: 2090000000000,
    peRatio: 24.1,
    dividendYield: 0.48,
    fiftyTwoWeekHigh: 191.75,
    fiftyTwoWeekLow: 120.21,
    description: 'Alphabet Inc. operates Google Search, YouTube, Android, Google Cloud, Waymo, and Gemini AI technologies.',
    avgVolume: '28.1M',
    historicalPrices: [
      { date: '6M ago', price: 142.10 },
      { date: '5M ago', price: 153.80 },
      { date: '4M ago', price: 171.20 },
      { date: '3M ago', price: 182.40 },
      { date: '2M ago', price: 175.10 },
      { date: '1M ago', price: 166.40 },
      { date: 'Today', price: 168.30 },
    ]
  },
  META: {
    ticker: 'META',
    name: 'Meta Platforms Inc.',
    sector: 'Technology',
    assetType: 'stock',
    price: 495.20,
    changeDay: 8.40,
    changeDayPercent: 1.73,
    marketCap: 1250000000000,
    peRatio: 26.8,
    dividendYield: 0.40,
    fiftyTwoWeekHigh: 542.81,
    fiftyTwoWeekLow: 279.40,
    description: 'Meta builds technology that helps people connect, find communities, and grow businesses across Facebook, Instagram, WhatsApp, and Quest VR.',
    avgVolume: '16.9M',
    historicalPrices: [
      { date: '6M ago', price: 390.00 },
      { date: '5M ago', price: 470.10 },
      { date: '4M ago', price: 442.00 },
      { date: '3M ago', price: 501.20 },
      { date: '2M ago', price: 485.50 },
      { date: '1M ago', price: 480.00 },
      { date: 'Today', price: 495.20 },
    ]
  },
  TSLA: {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Consumer Cyclical',
    assetType: 'stock',
    price: 212.50,
    changeDay: -3.20,
    changeDayPercent: -1.48,
    marketCap: 678000000000,
    peRatio: 61.2,
    dividendYield: 0.00,
    fiftyTwoWeekHigh: 271.00,
    fiftyTwoWeekLow: 138.80,
    description: 'Tesla designs, manufactures, and sells electric vehicles, solar energy systems, energy storage products, and humanoid robotics.',
    avgVolume: '75.1M',
    historicalPrices: [
      { date: '6M ago', price: 188.00 },
      { date: '5M ago', price: 175.20 },
      { date: '4M ago', price: 142.10 },
      { date: '3M ago', price: 180.50 },
      { date: '2M ago', price: 230.10 },
      { date: '1M ago', price: 218.40 },
      { date: 'Today', price: 212.50 },
    ]
  },
  SPY: {
    ticker: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    sector: 'Broad Market ETF',
    assetType: 'etf',
    price: 545.60,
    changeDay: 2.80,
    changeDayPercent: 0.52,
    marketCap: 560000000000,
    peRatio: 27.5,
    dividendYield: 1.25,
    fiftyTwoWeekHigh: 565.16,
    fiftyTwoWeekLow: 430.20,
    description: 'SPY tracks the S&P 500 Index, representing 500 of the largest publicly traded U.S. companies across all market sectors.',
    avgVolume: '54.3M',
    historicalPrices: [
      { date: '6M ago', price: 492.00 },
      { date: '5M ago', price: 505.40 },
      { date: '4M ago', price: 512.10 },
      { date: '3M ago', price: 538.20 },
      { date: '2M ago', price: 549.10 },
      { date: '1M ago', price: 540.00 },
      { date: 'Today', price: 545.60 },
    ]
  },
  QQQ: {
    ticker: 'QQQ',
    name: 'Invesco QQQ Trust',
    sector: 'Tech Growth ETF',
    assetType: 'etf',
    price: 472.30,
    changeDay: 5.10,
    changeDayPercent: 1.09,
    marketCap: 285000000000,
    peRatio: 31.2,
    dividendYield: 0.58,
    fiftyTwoWeekHigh: 503.52,
    fiftyTwoWeekLow: 355.10,
    description: 'QQQ tracks the Nasdaq-100 Index, holding top non-financial innovation companies including tech, communications, and consumer discretionary leaders.',
    avgVolume: '38.6M',
    historicalPrices: [
      { date: '6M ago', price: 420.00 },
      { date: '5M ago', price: 440.50 },
      { date: '4M ago', price: 450.10 },
      { date: '3M ago', price: 485.00 },
      { date: '2M ago', price: 478.40 },
      { date: '1M ago', price: 462.10 },
      { date: 'Today', price: 472.30 },
    ]
  },
  VOO: {
    ticker: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    sector: 'Broad Market ETF',
    assetType: 'etf',
    price: 501.10,
    changeDay: 2.60,
    changeDayPercent: 0.52,
    marketCap: 480000000000,
    peRatio: 27.5,
    dividendYield: 1.28,
    fiftyTwoWeekHigh: 519.20,
    fiftyTwoWeekLow: 395.40,
    description: 'VOO offers ultra-low expense ratio access to the 500 largest U.S. corporations with automatic dividend reinvestment potential.',
    avgVolume: '4.8M',
    historicalPrices: [
      { date: '6M ago', price: 451.20 },
      { date: '5M ago', price: 464.00 },
      { date: '4M ago', price: 470.50 },
      { date: '3M ago', price: 494.30 },
      { date: '2M ago', price: 504.10 },
      { date: '1M ago', price: 496.00 },
      { date: 'Today', price: 501.10 },
    ]
  },
  JPM: {
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financials',
    assetType: 'stock',
    price: 215.40,
    changeDay: 1.20,
    changeDayPercent: 0.56,
    marketCap: 615000000000,
    peRatio: 12.4,
    dividendYield: 2.14,
    fiftyTwoWeekHigh: 225.48,
    fiftyTwoWeekLow: 143.52,
    description: 'JPMorgan Chase is a global financial services firm providing investment banking, consumer banking, commercial banking, and asset management.',
    avgVolume: '9.2M',
    historicalPrices: [
      { date: '6M ago', price: 175.00 },
      { date: '5M ago', price: 188.40 },
      { date: '4M ago', price: 196.20 },
      { date: '3M ago', price: 204.10 },
      { date: '2M ago', price: 212.80 },
      { date: '1M ago', price: 210.00 },
      { date: 'Today', price: 215.40 },
    ]
  },
  JNJ: {
    ticker: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    assetType: 'stock',
    price: 156.80,
    changeDay: -0.40,
    changeDayPercent: -0.25,
    marketCap: 377000000000,
    peRatio: 22.1,
    dividendYield: 3.16,
    fiftyTwoWeekHigh: 168.96,
    fiftyTwoWeekLow: 143.16,
    description: 'Johnson & Johnson manufactures healthcare products, pharmaceuticals, and medical devices globally with a strong dividend record.',
    avgVolume: '7.1M',
    historicalPrices: [
      { date: '6M ago', price: 158.20 },
      { date: '5M ago', price: 152.40 },
      { date: '4M ago', price: 146.80 },
      { date: '3M ago', price: 148.50 },
      { date: '2M ago', price: 154.20 },
      { date: '1M ago', price: 157.00 },
      { date: 'Today', price: 156.80 },
    ]
  },
  WMT: {
    ticker: 'WMT',
    name: 'Walmart Inc.',
    sector: 'Consumer Staples',
    assetType: 'stock',
    price: 68.45,
    changeDay: 0.65,
    changeDayPercent: 0.96,
    marketCap: 549000000000,
    peRatio: 30.5,
    dividendYield: 1.21,
    fiftyTwoWeekHigh: 71.32,
    fiftyTwoWeekLow: 49.85,
    description: 'Walmart operates omni-channel retail stores, hypermarkets, and e-commerce platforms worldwide.',
    avgVolume: '14.3M',
    historicalPrices: [
      { date: '6M ago', price: 56.10 },
      { date: '5M ago', price: 59.80 },
      { date: '4M ago', price: 62.40 },
      { date: '3M ago', price: 66.80 },
      { date: '2M ago', price: 69.10 },
      { date: '1M ago', price: 67.50 },
      { date: 'Today', price: 68.45 },
    ]
  },
  AMD: {
    ticker: 'AMD',
    name: 'Advanced Micro Devices',
    sector: 'Technology',
    assetType: 'stock',
    price: 138.20,
    changeDay: 3.40,
    changeDayPercent: 2.52,
    marketCap: 223000000000,
    peRatio: 110.4,
    dividendYield: 0.00,
    fiftyTwoWeekHigh: 227.30,
    fiftyTwoWeekLow: 107.08,
    description: 'AMD produces high-performance processors, graphics cards (Radeon), and AI accelerator hardware for cloud and gaming.',
    avgVolume: '45.1M',
    historicalPrices: [
      { date: '6M ago', price: 172.00 },
      { date: '5M ago', price: 180.40 },
      { date: '4M ago', price: 155.10 },
      { date: '3M ago', price: 162.00 },
      { date: '2M ago', price: 145.80 },
      { date: '1M ago', price: 132.00 },
      { date: 'Today', price: 138.20 },
    ]
  },
  XOM: {
    ticker: 'XOM',
    name: 'Exxon Mobil Corporation',
    sector: 'Energy',
    assetType: 'stock',
    price: 118.60,
    changeDay: -1.10,
    changeDayPercent: -0.92,
    marketCap: 470000000000,
    peRatio: 14.1,
    dividendYield: 3.20,
    fiftyTwoWeekHigh: 123.75,
    fiftyTwoWeekLow: 97.48,
    description: 'Exxon Mobil explores for, produces, and refines crude oil and natural gas while expanding renewable energy technology.',
    avgVolume: '13.8M',
    historicalPrices: [
      { date: '6M ago', price: 102.00 },
      { date: '5M ago', price: 110.50 },
      { date: '4M ago', price: 118.20 },
      { date: '3M ago', price: 114.60 },
      { date: '2M ago', price: 116.80 },
      { date: '1M ago', price: 119.50 },
      { date: 'Today', price: 118.60 },
    ]
  }
};

// In-Memory Database Store
const users: User[] = [
  {
    id: 'usr_demo',
    email: 'investor@example.com',
    name: 'Alex Morgan',
    createdAt: new Date().toISOString()
  }
];

const passwords: Record<string, string> = {
  'investor@example.com': 'password123'
};

// Seed portfolio for Alex Morgan (Starts with 0 holdings)
const initialHoldings: Holding[] = [];

const portfolios: Portfolio[] = [
  {
    id: 'p_demo',
    userId: 'usr_demo',
    name: 'Core Portfolio',
    holdings: [],
    totalValue: 0,
    totalCost: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    dailyGainLoss: 0,
    dailyGainLossPercent: 0,
    holdingsCount: 0,
    updatedAt: new Date().toISOString()
  }
];

// Helper functions for portfolio math recalculation
export function recalculatePortfolio(portfolio: Portfolio): Portfolio {
  let totalValue = 0;
  let totalCost = 0;
  let dailyGainLoss = 0;

  const updatedHoldings = portfolio.holdings.map((h) => {
    const marketInfo = MARKET_STOCKS[h.ticker] || {
      price: h.currentPrice,
      changeDayPercent: 0,
      changeDay: 0,
      name: h.companyName,
      sector: h.sector,
      assetType: h.assetType
    };

    const currentPrice = marketInfo.price;
    const holdingValue = h.shares * currentPrice;
    const holdingCost = h.shares * h.purchasePrice;
    const totalGL = holdingValue - holdingCost;
    const totalGLPercent = holdingCost > 0 ? (totalGL / holdingCost) * 100 : 0;

    const dayChangePerShare = marketInfo.changeDay || (currentPrice * (marketInfo.changeDayPercent / 100));
    const hDailyGL = h.shares * dayChangePerShare;
    const hDailyGLPercent = marketInfo.changeDayPercent;

    totalValue += holdingValue;
    totalCost += holdingCost;
    dailyGainLoss += hDailyGL;

    return {
      ...h,
      currentPrice,
      companyName: marketInfo.name,
      sector: marketInfo.sector,
      assetType: marketInfo.assetType,
      totalValue: Number(holdingValue.toFixed(2)),
      totalGainLoss: Number(totalGL.toFixed(2)),
      totalGainLossPercent: Number(totalGLPercent.toFixed(2)),
      dailyGainLoss: Number(hDailyGL.toFixed(2)),
      dailyGainLossPercent: Number(hDailyGLPercent.toFixed(2)),
      allocationPercent: 0 // set below
    };
  });

  // Calculate allocations
  const holdingsWithAllocation = updatedHoldings.map((h) => ({
    ...h,
    allocationPercent: totalValue > 0 ? Number(((h.totalValue / totalValue) * 100).toFixed(1)) : 0
  }));

  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  const previousDayValue = totalValue - dailyGainLoss;
  const dailyGainLossPercent = previousDayValue > 0 ? (dailyGainLoss / previousDayValue) * 100 : 0;

  return {
    ...portfolio,
    holdings: holdingsWithAllocation,
    totalValue: Number(totalValue.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    totalGainLoss: Number(totalGainLoss.toFixed(2)),
    totalGainLossPercent: Number(totalGainLossPercent.toFixed(2)),
    dailyGainLoss: Number(dailyGainLoss.toFixed(2)),
    dailyGainLossPercent: Number(dailyGainLossPercent.toFixed(2)),
    holdingsCount: holdingsWithAllocation.length,
    updatedAt: new Date().toISOString()
  };
}

// Database helper functions
export const db = {
  findUserByEmail: (email: string): User | null => {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  createUser: (name: string, email: string, pass: string): User => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    passwords[email.toLowerCase()] = pass;

    // Create default starter portfolio (0 holdings)
    const newPortfolio: Portfolio = recalculatePortfolio({
      id: `p_${Date.now()}`,
      userId: newUser.id,
      name: `${name}'s Core Portfolio`,
      holdings: [],
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      dailyGainLoss: 0,
      dailyGainLossPercent: 0,
      holdingsCount: 0,
      updatedAt: new Date().toISOString()
    });
    portfolios.push(newPortfolio);

    return newUser;
  },

  verifyPassword: (email: string, pass: string): boolean => {
    return passwords[email.toLowerCase()] === pass;
  },

  getUserPortfolios: async (userId: string): Promise<Portfolio[]> => {
    const userPorts = portfolios.filter((p) => p.userId === userId);
    for (const port of userPorts) {
      for (const h of port.holdings) {
        try {
          const live = await fetchLiveMarketStock(h.ticker);
          if (live) {
            MARKET_STOCKS[h.ticker] = live;
            h.currentPrice = live.price;
            h.companyName = live.name || h.companyName;
          }
        } catch {
          // Keep existing if fetch fails
        }
      }
    }
    return userPorts.map((p) => recalculatePortfolio(p));
  },

  getPortfolioById: async (id: string, forceFresh = false): Promise<Portfolio | null> => {
    const portIndex = portfolios.findIndex((p) => p.id === id);
    if (portIndex === -1) return null;

    const port = portfolios[portIndex];
    for (const h of port.holdings) {
      try {
        const live = await fetchLiveMarketStock(h.ticker, forceFresh);
        if (live) {
          MARKET_STOCKS[h.ticker] = live;
          h.currentPrice = live.price;
          h.companyName = live.name || h.companyName;
        }
      } catch {
        // Keep existing if network issue
      }
    }

    portfolios[portIndex] = recalculatePortfolio(port);
    return portfolios[portIndex];
  },

  addHolding: async (portfolioId: string, ticker: string, shares: number, purchasePrice: number): Promise<Holding | null> => {
    const portIndex = portfolios.findIndex((p) => p.id === portfolioId);
    if (portIndex === -1) return null;

    const tickerUpper = ticker.toUpperCase();
    let stockInfo = await fetchLiveMarketStock(tickerUpper, true);
    if (stockInfo) {
      MARKET_STOCKS[tickerUpper] = stockInfo;
    } else {
      stockInfo = MARKET_STOCKS[tickerUpper];
    }

    if (!stockInfo) {
      stockInfo = {
        ticker: tickerUpper,
        name: `${tickerUpper} Corp`,
        sector: 'Other',
        assetType: 'stock',
        price: purchasePrice,
        changeDay: 0,
        changeDayPercent: 0,
        marketCap: 10000000000,
        peRatio: 20,
        dividendYield: 1.0,
        fiftyTwoWeekHigh: purchasePrice * 1.1,
        fiftyTwoWeekLow: purchasePrice * 0.9,
        description: 'Publicly traded security.',
        avgVolume: '1.2M',
        historicalPrices: []
      };
      MARKET_STOCKS[tickerUpper] = stockInfo;
    }

    const newHolding: Holding = {
      id: `h_${Date.now()}`,
      portfolioId,
      ticker: tickerUpper,
      companyName: stockInfo.name,
      shares,
      purchasePrice,
      currentPrice: stockInfo.price,
      sector: stockInfo.sector,
      assetType: stockInfo.assetType,
      totalValue: shares * stockInfo.price,
      totalGainLoss: (shares * stockInfo.price) - (shares * purchasePrice),
      totalGainLossPercent: ((shares * stockInfo.price) - (shares * purchasePrice)) / (shares * purchasePrice) * 100,
      dailyGainLoss: shares * (stockInfo.changeDay || 0),
      dailyGainLossPercent: stockInfo.changeDayPercent || 0,
      allocationPercent: 0,
      addedAt: new Date().toISOString().split('T')[0]
    };

    // Check if user already holds this ticker, combine or append
    const existingIndex = portfolios[portIndex].holdings.findIndex((h) => h.ticker === tickerUpper);
    if (existingIndex > -1) {
      const existing = portfolios[portIndex].holdings[existingIndex];
      const totalShares = existing.shares + shares;
      const weightedAvgPrice = ((existing.shares * existing.purchasePrice) + (shares * purchasePrice)) / totalShares;

      portfolios[portIndex].holdings[existingIndex] = {
        ...existing,
        shares: totalShares,
        purchasePrice: Number(weightedAvgPrice.toFixed(2)),
        currentPrice: stockInfo.price
      };
    } else {
      portfolios[portIndex].holdings.push(newHolding);
    }

    portfolios[portIndex] = recalculatePortfolio(portfolios[portIndex]);
    return newHolding;
  },

  updateHolding: async (portfolioId: string, holdingId: string, shares: number, purchasePrice: number): Promise<boolean> => {
    const portIndex = portfolios.findIndex((p) => p.id === portfolioId);
    if (portIndex === -1) return false;

    const holdingIndex = portfolios[portIndex].holdings.findIndex((h) => h.id === holdingId);
    if (holdingIndex === -1) return false;

    const holding = portfolios[portIndex].holdings[holdingIndex];
    try {
      const live = await fetchLiveMarketStock(holding.ticker);
      if (live) {
        MARKET_STOCKS[holding.ticker] = live;
        holding.currentPrice = live.price;
      }
    } catch {
      // Continue
    }

    portfolios[portIndex].holdings[holdingIndex].shares = shares;
    portfolios[portIndex].holdings[holdingIndex].purchasePrice = purchasePrice;

    portfolios[portIndex] = recalculatePortfolio(portfolios[portIndex]);
    return true;
  },

  deleteHolding: (portfolioId: string, holdingId: string): boolean => {
    const portIndex = portfolios.findIndex((p) => p.id === portfolioId);
    if (portIndex === -1) return false;

    portfolios[portIndex].holdings = portfolios[portIndex].holdings.filter((h) => h.id !== holdingId);
    portfolios[portIndex] = recalculatePortfolio(portfolios[portIndex]);
    return true;
  },

  searchStocks: async (query: string): Promise<StockDetail[]> => {
    const q = query.trim().toUpperCase();
    if (!q) {
      const popular = Object.values(MARKET_STOCKS).slice(0, 10);
      return popular;
    }

    const filtered = Object.values(MARKET_STOCKS).filter((s) =>
      s.ticker.includes(q) || s.name.toUpperCase().includes(q) || s.sector.toUpperCase().includes(q)
    );

    // If query looks like a specific stock ticker, fetch live real-time quote
    if (/^[A-Z0-9.\-]{1,6}$/.test(q)) {
      const live = await fetchLiveMarketStock(q);
      if (live) {
        MARKET_STOCKS[live.ticker] = live;
        const existingIdx = filtered.findIndex((s) => s.ticker === live.ticker);
        if (existingIdx > -1) {
          filtered[existingIdx] = live;
        } else {
          filtered.unshift(live);
        }
      }
    }

    return filtered;
  },

  getStockByTicker: async (ticker: string, forceFresh = false): Promise<StockDetail | null> => {
    const symbol = ticker.toUpperCase();
    const live = await fetchLiveMarketStock(symbol, forceFresh);
    if (live) {
      MARKET_STOCKS[symbol] = live;
      return live;
    }
    return MARKET_STOCKS[symbol] || null;
  }
};
