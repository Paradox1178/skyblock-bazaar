import { Link } from 'react-router-dom';
import { Item, getAveragePrice, getItemShops, getLowestPrice } from '@/data/items';

interface ItemCardProps {
  item: Item;
  showHot?: boolean;
}

const RARITY_BORDER: Record<string, string> = {
  common: 'border-border',
  uncommon: 'border-green-300',
  rare: 'border-blue-300',
  epic: 'border-purple-300',
  legendary: 'border-yellow-300',
};

const ItemCard = ({ item, showHot }: ItemCardProps) => {
  const avgPrice = getAveragePrice(item.id);
  const lowPrice = getLowestPrice(item.id);
  const shopCount = getItemShops(item.id).length;

  return (
    <Link to={`/items/${item.id}`} className={`item-card relative ${RARITY_BORDER[item.rarity]}`}>
      {showHot && shopCount >= 2 && (
        <span className="hot-badge absolute top-2 left-2">HOT</span>
      )}
      <span className="text-4xl mt-2">{item.icon}</span>
      <span className="font-bold text-sm text-center leading-tight text-card-foreground">
        {item.name}
      </span>
      {avgPrice !== null ? (
        <div className="text-center space-y-0.5">
          <span className="price-tag text-base">{lowPrice}$</span>
          <p className="text-xs text-muted-foreground">
            ⌀ {avgPrice}$ · {shopCount} {shopCount === 1 ? 'Shop' : 'Shops'}
          </p>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">Keine Angebote</span>
      )}
    </Link>
  );
};

export default ItemCard;
