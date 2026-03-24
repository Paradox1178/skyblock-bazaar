import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingDown, TrendingUp, BarChart3, MapPin, MessageSquareWarning } from 'lucide-react';
import { RARITY_LABELS, ShopListing, fetchItems, Item } from '@/data/items';
import { getShopsForItem, recordPriceSnapshot } from '@/api/client';
import TalerIcon from '@/components/TalerIcon';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import FeedbackDialog from '@/components/FeedbackDialog';

const ItemDetail = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [shops, setShops] = useState<ShopListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    fetchItems()
      .then(data => setItems(data))
      .catch(err => {
        console.error('Fehler beim Laden der Items:', err);
      })
      .finally(() => setLoadingItems(false));
  }, []);

  const item = items.find(i => i.id === itemId);

  useEffect(() => {
    if (!item) return;

    setLoading(true);
    getShopsForItem(item.id)
      .then(apiShops => {
        const mapped: ShopListing[] = apiShops.map(s => ({
          id: s.id,
          shopName: s.shop_name,
          ownerName: s.owner_name,
          itemId: s.item_id,
          price: s.price,
          coordinates: s.coordinates || undefined,
          createdAt: s.created_at?.split('T')[0] || '',
        }));
        setShops(mapped);

        if (mapped.length > 0) {
          const prices = mapped.map(s => s.price);
          recordPriceSnapshot(item.id, {
            avg_price: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
            low_price: Math.min(...prices),
            high_price: Math.max(...prices),
            shop_count: prices.length,
          }).catch(() => {});
        }
      })
      .catch(() => setShops([]))
      .finally(() => setLoading(false));
  }, [item?.id]);

  if (loadingItems) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="mc-panel p-8 text-center">
          <p className="text-lg text-white">Item wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="mc-panel p-8 text-center">
          <p className="text-lg text-white mb-4">Item nicht gefunden</p>
          <Link to="/items" className="mc-btn-primary inline-block">Zurück zu Items</Link>
        </div>
      </div>
    );
  }

  const prices = shops.map(s => s.price);
  const lowPrice = prices.length > 0 ? Math.min(...prices) : null;
  const highPrice = prices.length > 0 ? Math.max(...prices) : null;
  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
  const rarity = RARITY_LABELS[item.rarity];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link to="/items" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Zurück zum Katalog
        </Link>

        <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[inset_3px_3px_0px_#3c3c3c] p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="mc-item-slot bg-[#373737] border-2 border-[#1e1e1e] shadow-[inset_2px_2px_0px_#212121]" style={{ width: 100, height: 100 }}>
              <img src={item.icon} alt={item.name} className="pixelated w-16 h-16" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-3">
                <h1 className="text-4xl font-black text-white drop-shadow-[3px_3px_0px_#000]">{item.name}</h1>
                <span className={`text-xs font-bold px-3 py-1 uppercase tracking-wider ${rarity.cls}`}>{rarity.text}</span>
              </div>
              <p className="text-gray-400 font-bold uppercase text-sm tracking-widest border-l-4 border-yellow-600 pl-3">{item.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {avgPrice !== null ? (
              <>
                <div className="mc-inventory-card bg-black/40 border-[#444] p-4 flex flex-col items-center">
                  <TrendingDown className="h-5 w-5 text-green-500 mb-2" />
                  <span className="text-xl font-bold flex items-center gap-1 text-white">{lowPrice} <TalerIcon className="h-4 w-4" /></span>
                  <p className="text-[10px] uppercase font-black text-green-500 mt-1">Günstigster</p>
                </div>
                <div className="mc-inventory-card bg-black/40 border-[#444] p-4 flex flex-col items-center">
                  <BarChart3 className="h-5 w-5 text-blue-500 mb-2" />
                  <span className="text-xl font-bold flex items-center gap-1 text-white">{avgPrice} <TalerIcon className="h-4 w-4" /></span>
                  <p className="text-[10px] uppercase font-black text-blue-500 mt-1">Schnitt</p>
                </div>
                <div className="mc-inventory-card bg-black/40 border-[#444] p-4 flex flex-col items-center">
                  <TrendingUp className="h-5 w-5 text-red-500 mb-2" />
                  <span className="text-xl font-bold flex items-center gap-1 text-white">{highPrice} <TalerIcon className="h-4 w-4" /></span>
                  <p className="text-[10px] uppercase font-black text-red-500 mt-1">Teuerster</p>
                </div>
              </>
            ) : (
              <>
                <div className="mc-inventory-card bg-black/40 border-[#444] p-4 flex flex-col items-center">
                  <TrendingDown className="h-5 w-5 text-gray-600 mb-2" />
                  <span className="text-xl font-bold text-gray-500">—</span>
                  <p className="text-[10px] uppercase font-black text-gray-600 mt-1">Günstigster</p>
                </div>
                <div className="mc-inventory-card bg-black/40 border-[#444] p-4 flex flex-col items-center">
                  <BarChart3 className="h-5 w-5 text-gray-600 mb-2" />
                  <span className="text-xl font-bold text-gray-500">—</span>
                  <p className="text-[10px] uppercase font-black text-gray-600 mt-1">Schnitt</p>
                </div>
                <div className="mc-inventory-card bg-black/40 border-[#444] p-4 flex flex-col items-center">
                  <TrendingUp className="h-5 w-5 text-gray-600 mb-2" />
                  <span className="text-xl font-bold text-gray-500">—</span>
                  <p className="text-[10px] uppercase font-black text-gray-600 mt-1">Teuerster</p>
                </div>
              </>
            )}
            <div className="mc-inventory-card bg-black/40 border-[#444] p-4 flex flex-col items-center">
              <BarChart3 className="h-5 w-5 text-yellow-500 mb-2" />
              <span className="text-xl font-bold flex items-center gap-1 text-white">{item.marketPrice || 0} <TalerIcon className="h-4 w-4" /></span>
              <p className="text-[10px] uppercase font-black text-yellow-500 mt-1">Marktwert</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <PriceHistoryChart itemId={item.id} />
        </div>

        <div className="flex items-center justify-between mb-6 px-1 border-l-4 border-yellow-600 pl-4">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white">
            Verfügbare Shops <span className="text-gray-500 ml-2">({shops.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-16 text-center">
            <p className="text-gray-400 font-bold animate-pulse">Lade Shops...</p>
          </div>
        ) : shops.length > 0 ? (
          <div className="space-y-4">
            {shops.sort((a, b) => a.price - b.price).map((shop, i) => (
              <div key={shop.id} className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-gray-500 transition-colors shadow-lg">
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="mc-item-slot bg-[#373737]" style={{ width: 50, height: 50 }}>
                    <span className="font-pixel text-[12px] text-yellow-500">#{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl leading-tight">{shop.shopName}</h3>
                    <div className="flex flex-wrap gap-x-6 mt-2 text-sm font-bold">
                      <span className="text-gray-400 flex items-center gap-2">
                        Verkäufer:
                        <span className="text-white flex items-center gap-1">
                          <img src={`https://mc-heads.net/avatar/${shop.ownerName}/16`} alt="" className="w-4 h-4 pixelated" />
                          {shop.ownerName}
                        </span>
                      </span>
                      {shop.coordinates && (
                        <span className="text-primary flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {shop.coordinates}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end gap-3">
                  <div className="text-right">
                    <span className="text-3xl font-black text-yellow-500 flex items-center gap-2 justify-end drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                      {shop.price} <TalerIcon className="w-6 h-6" />
                    </span>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Eingetragen am {shop.createdAt}</p>
                  </div>
                  {i === 0 && <span className="mc-hot-badge text-[10px]">BESTER PREIS</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-16 text-center shadow-xl">
            <p className="text-xl text-gray-400 font-bold mb-8 italic">
              "In den Tiefen des Bazaars wurde dieses Item noch nicht gesichtet..."
            </p>
            <Link to="/settings" className="mc-category-active px-8 py-3 text-lg">Angebot über Profil eintragen</Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => setShowFeedback(true)}
            className="mc-btn-primary flex items-center gap-2 mx-auto px-5 py-2.5"
          >
            <MessageSquareWarning className="h-4 w-4" />
            Fehler melden / Feedback geben
          </button>
        </div>

        <FeedbackDialog
          open={showFeedback}
          onClose={() => setShowFeedback(false)}
          itemId={item.id}
          itemName={item.name}
        />
      </div>
    </div>
  );
};

export default ItemDetail;