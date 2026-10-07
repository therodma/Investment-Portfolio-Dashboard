import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { Portfolio } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check endpoints for container and reverse proxy probes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Lazy initialize Google Gemini AI SDK server-side
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return aiClient;
}

// Simple bearer token mock validation
function getUserIdFromReq(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer token_')) {
    const email = authHeader.replace('Bearer token_', '');
    const user = db.findUserByEmail(email);
    if (user) return user.id;
  }
  // Default to demo user for frictionless usage
  return 'usr_demo';
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// 1. Authentication APIs
app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required.' });
    return;
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    res.status(400).json({ error: 'User with this email already exists.' });
    return;
  }

  const user = db.createUser(name, email, password);
  const token = `token_${user.email}`;
  res.json({ user, token });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = db.findUserByEmail(email);
  if (!user || !db.verifyPassword(email, password)) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const token = `token_${user.email}`;
  res.json({ user, token });
});

app.get('/api/auth/me', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const portfolios = await db.getUserPortfolios(userId);
  if (!portfolios.length) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const user = db.findUserByEmail(portfolios[0].userId === 'usr_demo' ? 'investor@example.com' : 'investor@example.com') || {
    id: userId,
    email: 'investor@example.com',
    name: 'Alex Morgan',
    createdAt: new Date().toISOString()
  };
  res.json({ user });
});

// 2. Portfolio Management APIs
app.get('/api/portfolios', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const userPortfolios = await db.getUserPortfolios(userId);
  res.json(userPortfolios);
});

app.get('/api/portfolios/:id', async (req: Request, res: Response) => {
  const forceFresh = req.query.fresh === 'true';
  const portfolio = await db.getPortfolioById(req.params.id, forceFresh);
  if (!portfolio) {
    res.status(404).json({ error: 'Portfolio not found' });
    return;
  }
  res.json(portfolio);
});

app.post('/api/portfolios/:id/holdings', async (req: Request, res: Response) => {
  const { ticker, shares, purchasePrice } = req.body;
  if (!ticker || !shares || !purchasePrice || shares <= 0 || purchasePrice <= 0) {
    res.status(400).json({ error: 'Please provide valid ticker, shares, and purchase price.' });
    return;
  }

  const holding = await db.addHolding(req.params.id, ticker, Number(shares), Number(purchasePrice));
  if (!holding) {
    res.status(404).json({ error: 'Portfolio not found.' });
    return;
  }

  const updatedPortfolio = await db.getPortfolioById(req.params.id);
  res.json(updatedPortfolio);
});

app.put('/api/portfolios/:id/holdings/:holdingId', async (req: Request, res: Response) => {
  const { shares, purchasePrice } = req.body;
  if (!shares || !purchasePrice || shares <= 0 || purchasePrice <= 0) {
    res.status(400).json({ error: 'Valid shares and purchase price required.' });
    return;
  }

  const success = await db.updateHolding(req.params.id, req.params.holdingId, Number(shares), Number(purchasePrice));
  if (!success) {
    res.status(404).json({ error: 'Holding or portfolio not found.' });
    return;
  }

  const updatedPortfolio = await db.getPortfolioById(req.params.id);
  res.json(updatedPortfolio);
});

app.delete('/api/portfolios/:id/holdings/:holdingId', async (req: Request, res: Response) => {
  const success = db.deleteHolding(req.params.id, req.params.holdingId);
  if (!success) {
    res.status(404).json({ error: 'Holding or portfolio not found.' });
    return;
  }

  const updatedPortfolio = await db.getPortfolioById(req.params.id);
  res.json(updatedPortfolio);
});

// 3. Stock Search & Details APIs
app.get('/api/stocks/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const results = await db.searchStocks(query);
  res.json(results);
});

app.get('/api/stocks/:ticker', async (req: Request, res: Response) => {
  const forceFresh = req.query.fresh === 'true';
  const stock = await db.getStockByTicker(req.params.ticker, forceFresh);
  if (!stock) {
    res.status(404).json({ error: 'Stock ticker not found' });
    return;
  }
  res.json(stock);
});

// 4. AI Portfolio Summary API (Gemini integration server-side)
app.post('/api/ai/summary', async (req: Request, res: Response) => {
  const { portfolioId, focus } = req.body;
  const portfolio: Portfolio | null = await db.getPortfolioById(portfolioId || 'p_demo');

  if (!portfolio || portfolio.holdings.length === 0) {
    res.json({
      summary: 'Your portfolio is currently empty. Add stocks or ETFs to generate intelligence insights.',
      keyPoints: ['No holdings detected.'],
      diversificationScore: 0,
      riskLevel: 'Low',
      topConcentration: { ticker: 'N/A', percentage: 0 },
      generatedAt: new Date().toLocaleTimeString()
    });
    return;
  }

  // Pre-compute mathematical analytics for deterministic insights
  const holdingsSummary = portfolio.holdings.map((h) => ({
    ticker: h.ticker,
    name: h.companyName,
    percentage: h.allocationPercent,
    sector: h.sector,
    value: h.totalValue,
    gainLossPercent: h.totalGainLossPercent
  }));

  // Sector breakdown
  const sectorMap: Record<string, number> = {};
  portfolio.holdings.forEach((h) => {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.allocationPercent;
  });

  const sortedSectors: [string, number][] = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);
  const topSector: [string, number] = sortedSectors[0] ? sortedSectors[0] : ['Diverse', 0];
  const topHolding = [...portfolio.holdings].sort((a, b) => b.allocationPercent - a.allocationPercent)[0];

  const techWeight = sectorMap['Technology'] || 0;
  const diversificationScore = Math.max(20, Math.min(95, Math.round(100 - (topHolding.allocationPercent * 1.1) + (Object.keys(sectorMap).length * 8))));
  const riskLevel = techWeight > 50 || topHolding.allocationPercent > 35 ? 'High' : techWeight > 30 ? 'Moderate' : 'Low';

  // If Gemini API Key exists, generate plain English AI summary
  const geminiClient = getGeminiClient();
  if (geminiClient) {
    try {
      const promptText = `
You are a senior financial intelligence assistant.
Analyze the following portfolio and summarize it in simple, direct English without financial jargon.

Portfolio Stats:
- Total Value: $${portfolio.totalValue.toLocaleString()}
- Total Return: ${portfolio.totalGainLossPercent >= 0 ? '+' : ''}${portfolio.totalGainLossPercent}% ($${portfolio.totalGainLoss.toLocaleString()})
- Total Holdings: ${portfolio.holdingsCount}
- Top Sector: ${topSector[0]} (${topSector[1].toFixed(1)}% weight)
- Top Holding: ${topHolding.companyName} (${topHolding.ticker}) makes up ${topHolding.allocationPercent}% of the portfolio.
- Sector Breakdown: ${JSON.stringify(sectorMap)}
- Holdings List: ${JSON.stringify(holdingsSummary)}

Focus: ${focus || 'general summary'}

Requirements:
- Explain everything in simple English suitable for a everyday investor.
- Provide a clear 2-3 sentence overview paragraph.
- Provide 3 bullet key points (e.g., "Your portfolio is heavily invested in technology at ${topSector[1].toFixed(1)}%", "${topHolding.companyName} makes up ${topHolding.allocationPercent}% of your portfolio", "Your dividend yield is balanced with growth exposure").
- Be objective, encouraging, and clear.
- Return output strictly in standard JSON format:
{
  "summary": "Plain English summary narrative...",
  "keyPoints": ["Bullet 1", "Bullet 2", "Bullet 3"]
}
`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);

      res.json({
        summary: parsed.summary,
        keyPoints: parsed.keyPoints || [],
        diversificationScore,
        riskLevel,
        topConcentration: { ticker: topHolding.ticker, percentage: topHolding.allocationPercent },
        generatedAt: new Date().toLocaleTimeString()
      });
      return;
    } catch (error) {
      console.error('Gemini AI call error, falling back to smart analytical engine:', error);
    }
  }

  // Smart fallback narrative engine in plain English if Gemini key is not set
  let overviewText = '';
  if (topHolding.allocationPercent > 30) {
    overviewText = `${topHolding.companyName} (${topHolding.ticker}) makes up ${topHolding.allocationPercent}% of your total portfolio, creating high concentration. `;
  } else {
    overviewText = `Your portfolio is well balanced with your largest holding being ${topHolding.companyName} at ${topHolding.allocationPercent}%. `;
  }

  if (topSector[1] > 40) {
    overviewText += `Your investments are heavily concentrated in ${topSector[0]} (${topSector[1].toFixed(1)}% weight). Consider expanding into other non-correlated sectors for greater stability.`;
  } else {
    overviewText += `Your investments are diversified across ${sortedSectors.length} different sectors, led by ${topSector[0]}.`;
  }

  const keyPoints = [
    `Your portfolio is heavily invested in ${topSector[0].toLowerCase()} (${topSector[1].toFixed(1)}% total allocation).`,
    `${topHolding.companyName} (${topHolding.ticker}) makes up ${topHolding.allocationPercent}% of your portfolio.`,
    portfolio.totalGainLossPercent >= 0
      ? `Your portfolio has gained +${portfolio.totalGainLossPercent}% overall since purchase.`
      : `Your portfolio is down ${portfolio.totalGainLossPercent}% relative to initial purchase costs.`
  ];

  res.json({
    summary: overviewText,
    keyPoints,
    diversificationScore,
    riskLevel,
    topConcentration: { ticker: topHolding.ticker, percentage: topHolding.allocationPercent },
    generatedAt: new Date().toLocaleTimeString()
  });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE SETUP FOR DEV & PROD
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio Intelligence Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup encountered an error:', err);
  process.exit(1);
});
