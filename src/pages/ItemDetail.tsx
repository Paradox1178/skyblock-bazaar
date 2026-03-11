import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingDown, TrendingUp, BarChart3, MapPin, Clock } from 'lucide-react';
import { DEFAULT_ITEMS, getItemShops, getAveragePrice, getLowestPrice, getHighestPrice } from '@/data/items';

const RARITY_LABEL: Record<string, { text: string; cls: string }> = {
  common: { text: 'Common', cls: 'bg-gray-100 text-gray-600' },
  uncommon: { text: 'Uncommon', cls: 'bg-green-100 text-green-700' },
  rare: { text: 'Rare', cls: 'bg-blue-100 text-blue-700' },
  epic: { text: 'Epic', cls: 'bg-purple-100 text-purple-700' },
  legendary: { text: 'Legendary', cls: 'bg-yellow-100 text-yellow-700' },
};

const ItemDetail = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const item = DEFAULT_ITEMS.find(i => i.id === itemId);

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Item nicht gefunden</p>
        <Link to="/items" className="btn-accent inline-block mt-4">Zurück zu Items</Link>
      </div>
    );
  }

  const shops = getItemShops(item.id);
  const avgPrice = getAveragePrice(item.id);
  const lowPrice = getLowestPrice(item.id);
  const highPrice = getHighestPrice(item.id);
  const rarity = RARITY_LABEL[item.rarity];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/items" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Zurück zu Items
      </Link>

      {/* Item Header Card */}
      <div className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center text-5xl shrink-0">
            {item.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-foreground">{item.name}</h1>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rarity.cls}`}>
                {rarity.text}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{item.category}</p>
          </div>
        </div>

        {/* Price stats */}
        {avgPrice !== null && (
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <TrendingDown className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <span className="text-xl font-extrabold text-green-600">{lowPrice}$</span>
              <p className="text-xs text-green-600/70 mt-0.5">Günstigster</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <BarChart3 className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <span className="text-xl font-extrabold text-blue-600">{avgPrice}$</span>
              <p className="text-xs text-blue-600/70 mt-0.5">Durchschnitt</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <TrendingUp className="h-5 w-5 text-red-500 mx-auto mb-1" />
              <span className="text-xl font-extrabold text-red-500">{highPrice}$</span>
              <p className="text-xs text-red-500/70 mt-0.5">Teuerster</p>
            </div>
          </div>
        )}
      </div>

      {/* Shop Listings */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Shops mit diesem Item 🏪</h2>
        <span className="text-sm text-muted-foreground">{shops.length} Angebote</span>
      </div>

      {shops.length > 0 ? (
        <div className="space-y-3">
          {shops
            .sort((a, b) => a.price - b.price)
            .map((shop, i) => (
              <div key={shop.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    #{i + 1}
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
                  <span className="price-tag text-xl">{shop.price}$</span>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="h-3 w-3" /> {shop.createdAt}
                  </p>
                  {i === 0 && shops.length > 1 && (
                    <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                      BESTER PREIS
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border p-10 text-center">
          <p className="text-lg text-muted-foreground mb-2">Noch keine Shops für dieses Item 😢</p>
          <Link to="/submit" className="btn-accent inline-block">
            Shop eintragen
          </Link>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
