import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';
import { DEFAULT_ITEMS, RARITY_COLORS, getItemShops, getAveragePrice, getLowestPrice, getHighestPrice } from '@/data/items';

const ItemDetail = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const item = DEFAULT_ITEMS.find(i => i.id === itemId);

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="font-minecraft text-sm text-muted-foreground">Item nicht gefunden</p>
        <Link to="/items" className="mc-button-primary text-[10px] mt-4 inline-block">
          Zurück
        </Link>
      </div>
    );
  }

  const shops = getItemShops(item.id);
  const avgPrice = getAveragePrice(item.id);
  const lowPrice = getLowestPrice(item.id);
  const highPrice = getHighestPrice(item.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/items" className="mc-button text-[10px] inline-flex items-center gap-1 mb-6">
        <ArrowLeft className="h-3 w-3" /> Zurück
      </Link>

      {/* Item Header */}
      <div className="mc-panel p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{item.icon}</span>
          <div>
            <h1 className={`font-minecraft text-sm ${RARITY_COLORS[item.rarity]}`}>{item.name}</h1>
            <p className="font-minecraft-body text-sm text-muted-foreground mt-1">
              {item.category} · <span className="capitalize">{item.rarity}</span>
            </p>
          </div>
        </div>

        {/* Price stats */}
        {avgPrice !== null ? (
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="mc-slot text-center py-3">
              <TrendingDown className="h-4 w-4 mc-text-emerald mx-auto mb-1" />
              <span className="font-minecraft text-xs mc-text-emerald block">{lowPrice}$</span>
              <span className="font-minecraft-body text-xs text-muted-foreground">Günstigster</span>
            </div>
            <div className="mc-slot text-center py-3">
              <BarChart3 className="h-4 w-4 mc-text-gold mx-auto mb-1" />
              <span className="font-minecraft text-xs mc-text-gold block">{avgPrice}$</span>
              <span className="font-minecraft-body text-xs text-muted-foreground">Durchschnitt</span>
            </div>
            <div className="mc-slot text-center py-3">
              <TrendingUp className="h-4 w-4 text-destructive mx-auto mb-1" />
              <span className="font-minecraft text-xs text-destructive block">{highPrice}$</span>
              <span className="font-minecraft-body text-xs text-muted-foreground">Teuerster</span>
            </div>
          </div>
        ) : (
          <p className="font-minecraft-body text-sm text-muted-foreground mt-4">
            Noch keine Preisdaten verfügbar.
          </p>
        )}
      </div>

      {/* Shop Listings */}
      <h2 className="font-minecraft text-xs mc-text-emerald mb-3">🏪 Shops mit diesem Item</h2>
      {shops.length > 0 ? (
        <div className="space-y-2">
          {shops
            .sort((a, b) => a.price - b.price)
            .map(shop => (
              <div key={shop.id} className="mc-slot flex items-center justify-between p-3">
                <div>
                  <span className="font-minecraft text-[10px] mc-text-gold">{shop.shopName}</span>
                  <p className="font-minecraft-body text-sm text-muted-foreground">
                    von {shop.ownerName}
                  </p>
                  {shop.coordinates && (
                    <p className="font-minecraft-body text-xs mc-text-diamond mt-0.5">
                      📍 {shop.coordinates}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-minecraft text-sm mc-text-gold">{shop.price}$</span>
                  <p className="font-minecraft-body text-xs text-muted-foreground">
                    {shop.createdAt}
                  </p>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="mc-panel p-6 text-center">
          <p className="font-minecraft-body text-sm text-muted-foreground">
            Noch keine Shops für dieses Item 😢
          </p>
          <Link to="/submit" className="mc-button-primary text-[10px] mt-3 inline-block">
            Shop einreichen
          </Link>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
