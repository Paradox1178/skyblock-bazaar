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
  icon: string; // path to image
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  marketPrice?: number;
}

export const CATEGORIES = [
  'Blöcke', 'Erze', 'Nahrung', 'Werkzeuge', 'Waffen', 'Rüstung',
  'Tränke', 'Redstone', 'Farmgüter', 'Sonstiges'
] as const;

export const RARITY_LABELS: Record<string, { text: string; cls: string }> = {
  common: { text: 'Common', cls: 'bg-muted text-muted-foreground' },
  uncommon: { text: 'Uncommon', cls: 'bg-green-100 text-green-700' },
  rare: { text: 'Rare', cls: 'bg-blue-100 text-blue-700' },
  epic: { text: 'Epic', cls: 'bg-purple-100 text-purple-700' },
  legendary: { text: 'Legendary', cls: 'bg-yellow-100 text-yellow-700' },
};

export const DEFAULT_ITEMS: Item[] = [
  { id: 'diamond', name: 'Diamant', category: 'Erze', icon: '/items/diamond.png', rarity: 'rare', marketPrice: 750 },
  { id: 'emerald', name: 'Smaragd', category: 'Erze', icon: '/items/emerald.png', rarity: 'uncommon', marketPrice: 180 },
  { id: 'iron_ingot', name: 'Eisenbarren', category: 'Erze', icon: '/items/iron_ingot.png', rarity: 'common', marketPrice: 22 },
  { id: 'gold_ingot', name: 'Goldbarren', category: 'Erze', icon: '/items/gold_ingot.png', rarity: 'uncommon', marketPrice: 90 },
  { id: 'netherite_ingot', name: 'Netheritbarren', category: 'Erze', icon: '/items/netherite_ingot.png', rarity: 'legendary', marketPrice: 4700 },

  { id: 'cobblestone', name: 'Bruchstein', category: 'Blöcke', icon: '/items/cobblestone.png', rarity: 'common', marketPrice: 1 },
  { id: 'oak_log', name: 'Eichenholz', category: 'Blöcke', icon: '/items/oak_log.png', rarity: 'common', marketPrice: 2 },
  { id: 'obsidian', name: 'Obsidian', category: 'Blöcke', icon: '/items/obsidian.png', rarity: 'rare', marketPrice: 60 },

  { id: 'enchanted_diamond', name: 'Verzauberter G. Apfel', category: 'Nahrung', icon: '/items/enchanted_diamond.gif', rarity: 'legendary', marketPrice: 8000 },
  { id: 'golden_apple', name: 'Goldener Apfel', category: 'Nahrung', icon: '/items/golden_apple.png', rarity: 'rare', marketPrice: 2300 },
  { id: 'steak', name: 'Steak', category: 'Nahrung', icon: '/items/steak.png', rarity: 'common', marketPrice: 12 },
  { id: 'bread', name: 'Brot', category: 'Nahrung', icon: '/items/bread.png', rarity: 'common', marketPrice: 4 },

  { id: 'diamond_sword', name: 'Diamantschwert', category: 'Waffen', icon: '/items/diamond_sword.png', rarity: 'rare', marketPrice: 600 },
  { id: 'diamond_pickaxe', name: 'Diamantspitzhacke', category: 'Werkzeuge', icon: '/items/diamond_pickaxe.png', rarity: 'rare', marketPrice: 650 },
  { id: 'diamond_armor', name: 'Diamantrüstung', category: 'Rüstung', icon: '/items/diamond_armor.png', rarity: 'rare', marketPrice: 2000 },

  { id: 'ender_pearl', name: 'Enderperle', category: 'Sonstiges', icon: '/items/ender_pearl.png', rarity: 'uncommon', marketPrice: 80 },
  { id: 'blaze_rod', name: 'Lohenrute', category: 'Sonstiges', icon: '/items/blaze_rod.png', rarity: 'uncommon', marketPrice: 120 },

  { id: 'redstone', name: 'Redstone', category: 'Redstone', icon: '/items/redstone.png', rarity: 'common', marketPrice: 6 },

  { id: 'slime_ball', name: 'Schleimball', category: 'Sonstiges', icon: '/items/slime_ball.png', rarity: 'uncommon', marketPrice: 50 },

  { id: 'sugar_cane', name: 'Zuckerrohr', category: 'Farmgüter', icon: '/items/sugar_cane.png', rarity: 'common', marketPrice: 3 },
  { id: 'wheat', name: 'Weizen', category: 'Farmgüter', icon: '/items/wheat.png', rarity: 'common', marketPrice: 2 },

  { id: 'potion_strength', name: 'Stärketrank', category: 'Tränke', icon: '/items/potion_strength.png', rarity: 'uncommon', marketPrice: 150 },
  { id: 'potion_speed', name: 'Schnelligkeitstrank', category: 'Tränke', icon: '/items/potion_speed.png', rarity: 'uncommon', marketPrice: 140 },
];

export const DEFAULT_SHOPS: ShopListing[] = [
  { id: '1', shopName: 'DiamantKönig Shop', ownerName: 'xXDiamantKingXx', itemId: 'diamond', price: 500, coordinates: '/visit  DiamantKing', createdAt: '2026-03-01' },
  { id: '2', shopName: 'Billig Erze', ownerName: 'MinerPro99', itemId: 'diamond', price: 450, coordinates: '/visit  MinerPro', createdAt: '2026-03-05' },
  { id: '3', shopName: 'DiamantKönig Shop', ownerName: 'xXDiamantKingXx', itemId: 'emerald', price: 200, coordinates: '/visit  DiamantKing', createdAt: '2026-03-01' },
  { id: '4', shopName: 'Stein & Co', ownerName: 'SteinMeister', itemId: 'cobblestone', price: 1, coordinates: '/visit  SteinCo', createdAt: '2026-03-02' },
  { id: '5', shopName: 'FoodMaster', ownerName: 'KochMeister', itemId: 'steak', price: 15, coordinates: '/visit  FoodMaster', createdAt: '2026-03-03' },
  { id: '6', shopName: 'Billig Erze', ownerName: 'MinerPro99', itemId: 'iron_ingot', price: 25, coordinates: '/visit  MinerPro', createdAt: '2026-03-05' },
  { id: '7', shopName: 'Billig Erze', ownerName: 'MinerPro99', itemId: 'gold_ingot', price: 100, coordinates: '/visit  MinerPro', createdAt: '2026-03-05' },
  { id: '8', shopName: 'Netherite Hub', ownerName: 'NetherKing', itemId: 'netherite_ingot', price: 5000, coordinates: '/visit  NetherHub', createdAt: '2026-03-08' },
  { id: '9', shopName: 'Alles Günstig', ownerName: 'DealerMax', itemId: 'diamond', price: 480, coordinates: '/visit  DealerMax', createdAt: '2026-03-10' },
  { id: '10', shopName: 'Holzfäller Shop', ownerName: 'WaldBoy', itemId: 'oak_log', price: 3, coordinates: '/visit  WaldBoy', createdAt: '2026-03-04' },
  { id: '11', shopName: 'FoodMaster', ownerName: 'KochMeister', itemId: 'bread', price: 5, coordinates: '/visit  FoodMaster', createdAt: '2026-03-03' },
  { id: '12', shopName: 'FoodMaster', ownerName: 'KochMeister', itemId: 'golden_apple', price: 2500, coordinates: '/visit  FoodMaster', createdAt: '2026-03-03' },
];

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
