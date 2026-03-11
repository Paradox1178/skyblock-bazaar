import { Link } from 'react-router-dom';
import { Item, RARITY_COLORS, getAveragePrice, getItemShops, getLowestPrice } from '@/data/items';

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const avgPrice = getAveragePrice(item.id);
  const lowPrice = getLowestPrice(item.id);
  const shopCount = getItemShops(item.id).length;

  return (
    <Link to={`/items/${item.id}`} className="mc-slot flex flex-col items-center gap-2 p-3 cursor-pointer group">
      <span className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</span>
      <span className={`font-minecraft text-[9px] text-center leading-tight ${RARITY_COLORS[item.rarity]}`}>
        {item.name}
      </span>
      {avgPrice !== null ? (
        <div className="text-center">
          <span className="font-minecraft-body text-sm mc-text-gold">{lowPrice}$</span>
          <span className="font-minecraft-body text-xs text-muted-foreground block">
            ⌀ {avgPrice}$ · {shopCount} {shopCount === 1 ? 'Shop' : 'Shops'}
          </span>
        </div>
      ) : (
        <span className="font-minecraft-body text-xs text-muted-foreground">Keine Angebote</span>
      )}
    </Link>
  );
};

export default ItemCard;
