import { useMemo } from 'react';
import { TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';
import { getPriceHistory, PriceHistoryEntry } from '@/data/priceHistory';
import TalerIcon from '@/components/TalerIcon';

interface PriceHistoryChartProps {
  itemId: string;
}

const PriceHistoryChart = ({ itemId }: PriceHistoryChartProps) => {
  const history = useMemo(() => getPriceHistory(itemId), [itemId]);

  if (history.length === 0) {
    return (
      <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-8 text-center">
        <BarChart3 className="h-10 w-10 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 text-sm font-bold">Noch keine Preishistorie verfügbar</p>
        <p className="text-gray-600 text-xs mt-1">Preise werden automatisch erfasst, sobald Angebote existieren.</p>
      </div>
    );
  }

  const maxPrice = Math.max(...history.map(e => e.highPrice));
  const minPrice = Math.min(...history.map(e => e.lowPrice));
  const range = maxPrice - minPrice || 1;

  // Calculate trend
  const lastEntry = history[history.length - 1];
  const prevEntry = history.length > 1 ? history[history.length - 2] : null;
  const trend = prevEntry ? lastEntry.avgPrice - prevEntry.avgPrice : 0;

  return (
    <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black flex items-center gap-2 text-white">
          <BarChart3 className="h-5 w-5 text-yellow-500" /> Preishistorie
        </h3>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-sm font-bold ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {trend > 0 ? '+' : ''}{trend} <TalerIcon className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Simple bar chart */}
      <div className="flex items-end gap-1 h-32 mb-4">
        {history.map((entry, i) => {
          const height = ((entry.avgPrice - minPrice) / range) * 100;
          const barHeight = Math.max(height, 8);
          return (
            <div
              key={entry.date}
              className="flex-1 flex flex-col items-center group relative"
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black/90 border border-[#333] p-2 text-[10px] whitespace-nowrap z-10">
                <p className="text-white font-bold">{entry.date}</p>
                <p className="text-yellow-500">Ø {entry.avgPrice} Taler</p>
                <p className="text-green-400">↓ {entry.lowPrice}</p>
                <p className="text-red-400">↑ {entry.highPrice}</p>
                <p className="text-gray-400">{entry.shopCount} Shops</p>
              </div>
              {/* Bar */}
              <div
                className="w-full bg-yellow-600/80 hover:bg-yellow-500 transition-colors cursor-pointer"
                style={{ height: `${barHeight}%`, minHeight: '4px' }}
              />
            </div>
          );
        })}
      </div>

      {/* Date range */}
      <div className="flex justify-between text-[9px] text-gray-600 font-bold uppercase">
        <span>{history[0].date}</span>
        <span>{history[history.length - 1].date}</span>
      </div>

      {/* Latest stats */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#333]">
        <div className="text-center">
          <p className="text-green-400 font-bold text-sm flex items-center justify-center gap-1">
            {lastEntry.lowPrice} <TalerIcon className="w-3 h-3" />
          </p>
          <p className="text-[9px] text-gray-500 uppercase font-black">Tief</p>
        </div>
        <div className="text-center">
          <p className="text-yellow-500 font-bold text-sm flex items-center justify-center gap-1">
            {lastEntry.avgPrice} <TalerIcon className="w-3 h-3" />
          </p>
          <p className="text-[9px] text-gray-500 uppercase font-black">Schnitt</p>
        </div>
        <div className="text-center">
          <p className="text-red-400 font-bold text-sm flex items-center justify-center gap-1">
            {lastEntry.highPrice} <TalerIcon className="w-3 h-3" />
          </p>
          <p className="text-[9px] text-gray-500 uppercase font-black">Hoch</p>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryChart;
