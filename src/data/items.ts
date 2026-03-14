import rawItems from './minecraft_items.json';

export interface ShopListing {
  id: string;
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
  'Blöcke', 'Erze', 'Nahrung', 'Werkzeuge', 'Waffen', 'Rüstung',
  'Tränke', 'Redstone', 'Farmgüter', 'Sonstiges'
] as const;

export const RARITY_LABELS: Record<string, { text: string; cls: string }> = {
  common: { text: 'Common', cls: 'bg-[#3c3c3c] text-gray-300 border border-[#4a4a4a]' },
  uncommon: { text: 'Uncommon', cls: 'bg-[#1a3a1a] text-green-400 border border-green-900/50' },
  rare: { text: 'Rare', cls: 'bg-[#1a2a3a] text-blue-400 border border-blue-900/50' },
  epic: { text: 'Epic', cls: 'bg-[#2a1a3a] text-purple-400 border border-purple-900/50' },
  legendary: { text: 'Legendary', cls: 'bg-[#3a3a1a] text-yellow-400 border border-yellow-900/50' },
};

export const DEFAULT_ITEMS: Item[] = rawItems as Item[];

export const DEFAULT_SHOPS: ShopListing[] = [
  { id: '1', shopName: 'DiamantKönig Shop', ownerName: 'DerOmat', itemId: 'diamond', price: 500, coordinates: '/visit DerOmat', createdAt: '2026-03-01' },
  { id: '2', shopName: 'Billig Erze', ownerName: 'Dev_Dave', itemId: 'diamond', price: 450, coordinates: '/visit Dev_Dave', createdAt: '2026-03-05' },
];

const SHOPS_KEY = 'cytooxien_shops';
const AUTH_KEY = 'cytomarkt_user';

/** Get all shops including user profile shops */
export function getShops(): ShopListing[] {
  const stored = localStorage.getItem(SHOPS_KEY);
  const manualShops: ShopListing[] = stored ? JSON.parse(stored) : DEFAULT_SHOPS;

  // Also include shops from logged-in user profiles
  const profileShops = getProfileShops();
  
  return [...manualShops, ...profileShops];
}

/** Convert user profile shop items into ShopListings */
function getProfileShops(): ShopListing[] {
  const userStr = localStorage.getItem(AUTH_KEY);
  if (!userStr) return [];

  try {
    const user = JSON.parse(userStr);
    if (!user.shopName || !user.shopItems?.length) return [];

    return user.shopItems.map((item: { itemId: string; price: number }) => ({
      id: `profile_${user.username}_${item.itemId}`,
      shopName: user.shopName,
      ownerName: user.username,
      itemId: item.itemId,
      price: item.price,
      coordinates: user.shopCoordinates,
      createdAt: user.joinedAt || new Date().toISOString().split('T')[0],
    }));
  } catch {
    return [];
  }
}

export function addShop(shop: Omit<ShopListing, 'id' | 'createdAt'>): ShopListing {
  const stored = localStorage.getItem(SHOPS_KEY);
  const shops: ShopListing[] = stored ? JSON.parse(stored) : DEFAULT_SHOPS;
  const newShop: ShopListing = {
    ...shop,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString().split('T')[0],
  };
  shops.push(newShop);
  localStorage.setItem(SHOPS_KEY, JSON.stringify(shops));
  return newShop;
}

export function getItemShops(itemId: string): ShopListing[] {
  return getShops().filter(s => s.itemId === itemId);
}

export function getAveragePrice(itemId: string): number | null {
  const shops = getItemShops(itemId);
  if (shops.length === 0) return null;
  return Math.round(shops.reduce((sum, s) => sum + s.price, 0) / shops.length);
}

export function getLowestPrice(itemId: string): number | null {
  const shops = getItemShops(itemId);
  if (shops.length === 0) return null;
  return Math.min(...shops.map(s => s.price));
}

export function getHighestPrice(itemId: string): number | null {
  const shops = getItemShops(itemId);
  if (shops.length === 0) return null;
  return Math.max(...shops.map(s => s.price));
}
