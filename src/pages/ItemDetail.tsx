import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingDown, TrendingUp, BarChart3, MapPin, Clock } from 'lucide-react';
import { DEFAULT_ITEMS, RARITY_LABELS, getItemShops, getAveragePrice, getLowestPrice, getHighestPrice } from '@/data/items';

const ItemDetail = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const item = DEFAULT_ITEMS.find(i => i.id === itemId);

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Item nicht gefunden</p>
        <Link to="/items" className="mc-btn-primary inline-block mt-4">Zurück zu Items</Link>
      </div>
    );
  }

  const shops = getItemShops(item.id);
  const avgPrice = getAveragePrice(item.id);
  const lowPrice = getLowestPrice(item.id);
  const highPrice = getHighestPrice(item.id);
  const rarity = RARITY_LABELS[item.rarity];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/items" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Zurück zu Items
      </Link>

      {/* Item Header */}
      <div className="mc-panel p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="mc-item-slot" style={{ width: 80, height: 80 }}>
            <img src={item.icon} alt={item.name} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-foreground">{item.name}</h1>
              <span className={`text-xs font-bold px-2 py-0.5 ${rarity.cls}`}>
                {rarity.text}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{item.category}</p>
          </div>
        </div>

        {/* Price stats */}
        {avgPrice !== null && (
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="mc-inventory-card cursor-default hover:transform-none">
              <TrendingDown className="h-5 w-5 text-primary" />
              <span className="mc-price text-xl">{lowPrice}$</span>
              <p className="text-xs text-muted-foreground">Günstigster</p>
            </div>
            <div className="mc-inventory-card cursor-default hover:transform-none">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="mc-price text-xl">{avgPrice}$</span>
              <p className="text-xs text-muted-foreground">Durchschnitt</p>
            </div>
            <div className="mc-inventory-card cursor-default hover:transform-none">
              <TrendingUp className="h-5 w-5 text-accent" />
              <span className="mc-price text-xl">{highPrice}$</span>
              <p className="text-xs text-muted-foreground">Teuerster</p>
            </div>
          </div>
        )}
      </div>

      {/* Shop Listings */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="mc-section-title">Shops mit diesem Item 🏪</h2>
        <span className="text-sm text-muted-foreground">{shops.length} Angebote</span>
      </div>

      {shops.length > 0 ? (
        <div className="space-y-2">
          {shops
            .sort((a, b) => a.price - b.price)
            .map((shop, i) => (
              <div key={shop.id} className="mc-panel p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="mc-item-slot" style={{ width: 40, height: 40 }}>
                    <span className="font-pixel text-[8px] text-primary-foreground">#{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{shop.shopName}</h3>
                    <p className="text-sm text-muted-foreground">von {shop.ownerName}</p>
                    {shop.coordinates && (
                      <p className="text-xs text-primary flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {shop.coordinates}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="mc-price text-xl">{shop.price}$</span>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="h-3 w-3" /> {shop.createdAt}
                  </p>
                  {i === 0 && shops.length > 1 && (
                    <span className="mc-hot-badge mt-1 inline-block text-[10px]" style={{ backgroundColor: 'hsl(100 40% 35%)' }}>
                      BESTER PREIS
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="mc-panel p-10 text-center">
          <p className="text-lg text-muted-foreground mb-2">Noch keine Shops für dieses Item 😢</p>
          <Link to="/submit" className="mc-btn-primary inline-block">
            Shop eintragen
          </Link>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
