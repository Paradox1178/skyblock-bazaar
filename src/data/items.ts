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
  icon: string; // emoji for now
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export const CATEGORIES = [
  'Blöcke', 'Erze', 'Nahrung', 'Werkzeuge', 'Waffen', 'Rüstung',
  'Tränke', 'Redstone', 'Farmgüter', 'Sonstiges'
] as const;

export const RARITY_COLORS: Record<string, string> = {
  common: 'text-foreground',
  uncommon: 'mc-text-emerald',
  rare: 'mc-text-diamond',
  epic: 'text-purple-400',
  legendary: 'mc-text-gold',
};

export const DEFAULT_ITEMS: Item[] = [
  { id: 'diamond', name: 'Diamant', category: 'Erze', icon: '💎', rarity: 'rare' },
  { id: 'emerald', name: 'Smaragd', category: 'Erze', icon: '💚', rarity: 'uncommon' },
  { id: 'iron_ingot', name: 'Eisenbarren', category: 'Erze', icon: '🪨', rarity: 'common' },
  { id: 'gold_ingot', name: 'Goldbarren', category: 'Erze', icon: '🥇', rarity: 'uncommon' },
  { id: 'netherite_ingot', name: 'Netheritbarren', category: 'Erze', icon: '⬛', rarity: 'legendary' },
  { id: 'cobblestone', name: 'Bruchstein', category: 'Blöcke', icon: '🧱', rarity: 'common' },
  { id: 'oak_log', name: 'Eichenholz', category: 'Blöcke', icon: '🪵', rarity: 'common' },
  { id: 'obsidian', name: 'Obsidian', category: 'Blöcke', icon: '🟪', rarity: 'rare' },
  { id: 'enchanted_diamond', name: 'Verzauberter Diamant', category: 'Erze', icon: '✨', rarity: 'epic' },
  { id: 'golden_apple', name: 'Goldener Apfel', category: 'Nahrung', icon: '🍎', rarity: 'rare' },
  { id: 'steak', name: 'Steak', category: 'Nahrung', icon: '🥩', rarity: 'common' },
  { id: 'bread', name: 'Brot', category: 'Nahrung', icon: '🍞', rarity: 'common' },
  { id: 'diamond_sword', name: 'Diamantschwert', category: 'Waffen', icon: '⚔️', rarity: 'rare' },
  { id: 'diamond_pickaxe', name: 'Diamantspitzhacke', category: 'Werkzeuge', icon: '⛏️', rarity: 'rare' },
  { id: 'diamond_armor', name: 'Diamantrüstung', category: 'Rüstung', icon: '🛡️', rarity: 'rare' },
  { id: 'ender_pearl', name: 'Enderperle', category: 'Sonstiges', icon: '🟣', rarity: 'uncommon' },
  { id: 'blaze_rod', name: 'Lohenrute', category: 'Sonstiges', icon: '🔥', rarity: 'uncommon' },
  { id: 'redstone', name: 'Redstone', category: 'Redstone', icon: '🔴', rarity: 'common' },
  { id: 'slime_ball', name: 'Schleimball', category: 'Sonstiges', icon: '🟢', rarity: 'uncommon' },
  { id: 'sugar_cane', name: 'Zuckerrohr', category: 'Farmgüter', icon: '🌿', rarity: 'common' },
  { id: 'wheat', name: 'Weizen', category: 'Farmgüter', icon: '🌾', rarity: 'common' },
  { id: 'potion_strength', name: 'Stärketrank', category: 'Tränke', icon: '🧪', rarity: 'uncommon' },
  { id: 'potion_speed', name: 'Schnelligkeitstrank', category: 'Tränke', icon: '💨', rarity: 'uncommon' },
];

export const DEFAULT_SHOPS: ShopListing[] = [
  { id: '1', shopName: 'DiamantKönig Shop', ownerName: 'xXDiamantKingXx', itemId: 'diamond', price: 500, coordinates: '/is warp DiamantKing', createdAt: '2026-03-01' },
  { id: '2', shopName: 'Billig Erze', ownerName: 'MinerPro99', itemId: 'diamond', price: 450, coordinates: '/is warp MinerPro', createdAt: '2026-03-05' },
  { id: '3', shopName: 'DiamantKönig Shop', ownerName: 'xXDiamantKingXx', itemId: 'emerald', price: 200, coordinates: '/is warp DiamantKing', createdAt: '2026-03-01' },
  { id: '4', shopName: 'Stein & Co', ownerName: 'SteinMeister', itemId: 'cobblestone', price: 1, coordinates: '/is warp SteinCo', createdAt: '2026-03-02' },
  { id: '5', shopName: 'FoodMaster', ownerName: 'KochMeister', itemId: 'steak', price: 15, coordinates: '/is warp FoodMaster', createdAt: '2026-03-03' },
  { id: '6', shopName: 'Billig Erze', ownerName: 'MinerPro99', itemId: 'iron_ingot', price: 25, coordinates: '/is warp MinerPro', createdAt: '2026-03-05' },
  { id: '7', shopName: 'Billig Erze', ownerName: 'MinerPro99', itemId: 'gold_ingot', price: 100, coordinates: '/is warp MinerPro', createdAt: '2026-03-05' },
  { id: '8', shopName: 'Netherite Hub', ownerName: 'NetherKing', itemId: 'netherite_ingot', price: 5000, coordinates: '/is warp NetherHub', createdAt: '2026-03-08' },
  { id: '9', shopName: 'Alles Günstig', ownerName: 'DealerMax', itemId: 'diamond', price: 480, coordinates: '/is warp DealerMax', createdAt: '2026-03-10' },
  { id: '10', shopName: 'Holzfäller Shop', ownerName: 'WaldBoy', itemId: 'oak_log', price: 3, coordinates: '/is warp WaldBoy', createdAt: '2026-03-04' },
  { id: '11', shopName: 'FoodMaster', ownerName: 'KochMeister', itemId: 'bread', price: 5, coordinates: '/is warp FoodMaster', createdAt: '2026-03-03' },
  { id: '12', shopName: 'FoodMaster', ownerName: 'KochMeister', itemId: 'golden_apple', price: 2500, coordinates: '/is warp FoodMaster', createdAt: '2026-03-03' },
];

// Helper to get/set shops from localStorage
const SHOPS_KEY = 'cytooxien_shops';

export function getShops(): ShopListing[] {
  const stored = localStorage.getItem(SHOPS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(SHOPS_KEY, JSON.stringify(DEFAULT_SHOPS));
  return DEFAULT_SHOPS;
}

export function addShop(shop: Omit<ShopListing, 'id' | 'createdAt'>): ShopListing {
  const shops = getShops();
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
