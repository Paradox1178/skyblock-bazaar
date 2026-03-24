import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginPlayer, updatePlayer, addPlayerItem, removePlayerItem, ApiPlayer } from '@/api/client';
import { toast } from 'sonner';

export interface UserShopItem {
  itemId: string;
  price: number;
}

export interface UserProfile {
  id: number;
  username: string;
  shopName?: string;
  shopCoordinates?: string;
  shopItems: UserShopItem[];
  joinedAt: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: { shopName?: string; shopCoordinates?: string }) => Promise<void>;
  addItem: (itemId: string, price: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemPrice: (itemId: string, price: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = 'cytomarkt_user';

function apiPlayerToProfile(p: ApiPlayer): UserProfile {
  return {
    id: p.id,
    username: p.username,
    shopName: p.shop_name || undefined,
    shopCoordinates: p.shop_coordinates || undefined,
    shopItems: p.shopItems.map(i => ({ itemId: i.item_id, price: i.price })),
    joinedAt: p.joined_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    isAdmin: p.is_admin === 1,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const login = async (username: string) => {
    setLoading(true);
    try {
      const player = await loginPlayer(username);
      setUser(apiPlayerToProfile(player));
    } catch (err) {
      toast.error('Login fehlgeschlagen. Ist die API erreichbar?');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setUser(null);

  const updateProfileFn = async (updates: { shopName?: string; shopCoordinates?: string }) => {
    if (!user) return;
    try {
      await updatePlayer(user.id, {
        shop_name: updates.shopName,
        shop_coordinates: updates.shopCoordinates,
      });
      setUser(prev => prev ? {
        ...prev,
        shopName: updates.shopName,
        shopCoordinates: updates.shopCoordinates,
      } : null);
    } catch {
      toast.error('Profil konnte nicht gespeichert werden.');
    }
  };

  const addItemFn = async (itemId: string, price: number) => {
    if (!user) return;
    try {
      await addPlayerItem(user.id, itemId, price);
      setUser(prev => prev ? {
        ...prev,
        shopItems: [...prev.shopItems.filter(i => i.itemId !== itemId), { itemId, price }],
      } : null);
    } catch {
      toast.error('Item konnte nicht hinzugefügt werden.');
    }
  };

  const removeItemFn = async (itemId: string) => {
    if (!user) return;
    try {
      await removePlayerItem(user.id, itemId);
      setUser(prev => prev ? {
        ...prev,
        shopItems: prev.shopItems.filter(i => i.itemId !== itemId),
      } : null);
    } catch {
      toast.error('Item konnte nicht entfernt werden.');
    }
  };

  const updateItemPriceFn = async (itemId: string, price: number) => {
    if (!user) return;
    try {
      await addPlayerItem(user.id, itemId, price);
      setUser(prev => prev ? {
        ...prev,
        shopItems: prev.shopItems.map(i => i.itemId === itemId ? { ...i, price } : i),
      } : null);
    } catch {
      toast.error('Preis konnte nicht aktualisiert werden.');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateProfile: updateProfileFn,
      addItem: addItemFn,
      removeItem: removeItemFn,
      updateItemPrice: updateItemPriceFn,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
