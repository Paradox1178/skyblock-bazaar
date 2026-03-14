export interface PriceHistoryEntry {
  date: string;
  avgPrice: number;
  lowPrice: number;
  highPrice: number;
  shopCount: number;
}

const HISTORY_KEY = 'cytomarkt_price_history';

export function getPriceHistory(itemId: string): PriceHistoryEntry[] {
  const all = getAllHistory();
  return all[itemId] || [];
}

function getAllHistory(): Record<string, PriceHistoryEntry[]> {
  const stored = localStorage.getItem(HISTORY_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function recordPriceSnapshot(itemId: string, prices: number[]) {
  if (prices.length === 0) return;

  const all = getAllHistory();
  const today = new Date().toISOString().split('T')[0];
  const history = all[itemId] || [];

  const entry: PriceHistoryEntry = {
    date: today,
    avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    shopCount: prices.length,
  };

  // Update today's entry or add new
  const todayIdx = history.findIndex(e => e.date === today);
  if (todayIdx >= 0) {
    history[todayIdx] = entry;
  } else {
    history.push(entry);
  }

  // Keep last 30 days
  all[itemId] = history.slice(-30);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(all));
}
