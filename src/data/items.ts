import { getAllItems } from '@/api/client';

export interface ShopListing {
  id: string | number;
  shopName: string;
  ownerName: string;
  itemId: string;
  price: number;
  coordinates?: string;
  description?: string;
  createdAt: string;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  marketPrice?: number;
}

export const CATEGORIES = [
  'Blöcke',
  'Erze',
  'Nahrung',
  'Werkzeuge',
  'Waffen',
  'Rüstung',
  'Tränke',
  'Redstone',
  'Farmgüter',
  'Sonstiges',
] as const;

export const RARITY_LABELS: Record<string, { text: string; cls: string }> = {
  common: { text: 'Common', cls: 'bg-[#3c3c3c] text-gray-300 border border-[#4a4a4a]' },
  uncommon: { text: 'Uncommon', cls: 'bg-[#1a3a1a] text-green-400 border border-green-900/50' },
  rare: { text: 'Rare', cls: 'bg-[#1a2a3a] text-blue-400 border border-blue-900/50' },
  epic: { text: 'Epic', cls: 'bg-[#2a1a3a] text-purple-400 border border-purple-900/50' },
  legendary: { text: 'Legendary', cls: 'bg-[#3a3a1a] text-yellow-400 border border-yellow-900/50' },
};

function normalizeRarity(value: unknown): Item['rarity'] {
  const rarity = String(value || 'common').toLowerCase();
  if (rarity === 'uncommon' || rarity === 'rare' || rarity === 'epic' || rarity === 'legendary') {
    return rarity;
  }
  return 'common';
}

export async function fetchItems(): Promise<Item[]> {
  const raw = await getAllItems();

  return raw
    .map((item: any, index: number) => ({
      id: String(item?.id ?? '').trim(),
      name: String(item?.name ?? '').trim(),
      category: String(item?.category ?? 'Sonstiges').trim() || 'Sonstiges',
      icon: String(item?.icon ?? '/items/placeholder.png').trim() || '/items/placeholder.png',
      rarity: normalizeRarity(item?.rarity),
      marketPrice: Number(item?.marketPrice ?? 0),
      __index: index,
    }))
    .filter(item => item.id.length > 0 && item.name.length > 0)
    .map(({ __index, ...item }) => item);
}

/**
 * Fallback für alte Imports.
 * Nicht mehr aktiv für Datenquelle nutzen.
 */
export const DEFAULT_ITEMS: Item[] = [];