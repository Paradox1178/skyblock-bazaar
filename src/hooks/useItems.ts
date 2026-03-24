import { useQuery } from '@tanstack/react-query';
import { getAllItems, ApiItem } from '@/api/client';
import { Item } from '@/data/items';

function apiItemToItem(api: ApiItem): Item {
  // Determine icon: prefer icon_generated, then icon, then fallback
  const iconUrl = api.icon_generated
    || api.icon
    || (api.image_base64 ? `data:image/png;base64,${api.image_base64}` : '/placeholder.svg');

  return {
    id: api.item_key,
    dbId: api.id,
    name: api.display_name,
    category: api.category || 'Sonstiges',
    icon: iconUrl,
    rarity: (api.rarity as Item['rarity']) || 'common',
    marketPrice: api.market_price ?? 0,
    isCustom: api.is_custom === 1,
  };
}

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const apiItems = await getAllItems();
      return apiItems.map(apiItemToItem);
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}

export function useItem(itemKey: string | undefined) {
  const { data: items, isLoading } = useItems();
  const item = items?.find(i => i.id === itemKey);
  return { item, isLoading };
}
