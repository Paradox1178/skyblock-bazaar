import { Link } from 'react-router-dom';
import { Item, getAveragePrice, getItemShops, getLowestPrice } from '@/data/items';

interface ItemCardProps {
  item: Item;
  showHot?: boolean;
}

const ItemCard = ({ item, showHot }: ItemCardProps) => {
  const avgPrice = getAveragePrice(item.id);
  const lowPrice = getLowestPrice(item.id);
  const shopCount = getItemShops(item.id).length;

  return (
    <Link to={`/items/${item.id}`} className="mc-inventory-card relative">
      {showHot && shopCount >= 2 && (
        <span className="mc-hot-badge absolute top-1 left-1">HOT</span>
      )}
      <div className="mc-item-slot">
        <img src={item.icon} alt={item.name} loading="lazy" />
      </div>
      <span className="font-bold text-sm text-center leading-tight text-card-foreground">
        {item.name}
      </span>
      {avgPrice !== null ? (
        <div className="text-center space-y-0.5">
          <span className="mc-price text-base">{lowPrice}$</span>
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
