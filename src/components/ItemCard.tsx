import { Link } from 'react-router-dom';
import { Item, RARITY_LABELS, getItemShops, getLowestPrice } from '@/data/items';
import TalerIcon from './TalerIcon';

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const rarity = RARITY_LABELS[item.rarity];
  const shops = getItemShops(item.id);
  const lowPrice = getLowestPrice(item.id);

  return (
    <Link 
        to={`/items/${item.id}`} 
        className="mc-inventory-card bg-[#2a2a2a] border-2 border-[#1e1e1e] p-3 hover:scale-[1.05] hover:bg-[#323232] transition-all group shadow-[4px_4px_0px_rgba(0,0,0,0.3)] flex flex-col h-full"
      >
      <div className="mc-item-slot w-16 h-16 mx-auto mb-3 bg-[#373737] border-2 border-[#1e1e1e] shadow-[inset_2px_2px_0px_#212121] flex items-center justify-center relative">
        <img 
          src={item.icon} 
          alt={item.name} 
          className="w-10 h-10 pixelated object-contain z-10 group-hover:rotate-12 transition-transform"
          loading="lazy"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            // Falls 'grass_block.png' nicht da ist, versuche 'grass.png'
            if (item.id.includes('_block') && !img.src.includes('fix=1')) {
              img.src = `/items/${item.id.replace('_block', '')}.png?fix=1`;
            } 
            // Falls 'grass.png' nicht da ist, versuche 'grass_block.png'
            else if (!item.id.includes('_block') && !img.src.includes('fix=2')) {
              img.src = `/items/${item.id}_block.png?fix=2`;
            }
            else {
              // Letzter Fallback: Barrier oder ein Standard-Block
              img.src = 'https://mc-heads.net/item/barrier/64';
            }
          }}
        />
      </div>

      <div className="text-center flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-[11px] font-bold text-gray-200 leading-tight mb-1 line-clamp-2 min-h-[2.2rem]">
            {item.name}
          </h3>
          <span className={`inline-block text-[8px] px-1.5 py-0.5 font-bold uppercase ${rarity.cls}`}>
            {rarity.text}
          </span>
        </div>

        <div className="mt-3 pt-2 border-t border-white/5">
          {shops.length > 0 ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-yellow-500 font-bold">
                <span className="text-sm">{lowPrice}</span>
                <TalerIcon className="w-3 h-3" />
              </div>
              <p className="text-[8px] text-gray-500 uppercase">{shops.length} Angebote</p>
            </div>
          ) : (
            <p className="text-[9px] text-gray-600 font-medium italic">Keine Angebote</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;