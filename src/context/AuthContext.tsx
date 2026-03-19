import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  getCurrentAuth,
  logoutPlayer,
  updatePlayer,
  addPlayerItem,
  removePlayerItem,
  ApiPlayer,
} from '@/api/client';
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
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: { shopName?: string; shopCoordinates?: string }) => Promise<void>;
  addItem: (itemId: string, price: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemPrice: (itemId: string, price: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function apiPlayerToProfile(p: ApiPlayer): UserProfile {
  return {
    id: p.id,
    username: p.username,
    shopName: p.shop_name || undefined,
    shopCoordinates: p.shop_coordinates || undefined,
    shopItems: p.shopItems.map(i => ({ itemId: i.item_id, price: i.price })),
    joinedAt:
      p.created_at?.split('T')[0] ||
      p.joined_at?.split('T')[0] ||
      new Date().toISOString().split('T')[0],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const result = await getCurrentAuth();
      if (result.authenticated && result.player) {
        setUser(apiPlayerToProfile(result.player));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const logout = async () => {
    try {
      await logoutPlayer();
    } catch {
      // egal, wir leeren lokal trotzdem
    } finally {
      setUser(null);
    }
  };

  const updateProfileFn = async (updates: { shopName?: string; shopCoordinates?: string }) => {
    if (!user) return;

    try {
      await updatePlayer(user.id, {
        shop_name: updates.shopName,
        shop_coordinates: updates.shopCoordinates,
      });

      setUser(prev =>
        prev
          ? {
              ...prev,
              shopName: updates.shopName,
              shopCoordinates: updates.shopCoordinates,
            }
          : null
      );
    } catch {
      toast.error('Profil konnte nicht gespeichert werden.');
    }
  };

  const addItemFn = async (itemId: string, price: number) => {
    if (!user) return;

    try {
      await addPlayerItem(user.id, itemId, price);
      setUser(prev =>
        prev
          ? {
              ...prev,
              shopItems: [...prev.shopItems.filter(i => i.itemId !== itemId), { itemId, price }],
            }
          : null
      );
    } catch {
      toast.error('Item konnte nicht hinzugefügt werden.');
    }
  };

  const removeItemFn = async (itemId: string) => {
    if (!user) return;

    try {
      await removePlayerItem(user.id, itemId);
      setUser(prev =>
        prev
          ? {
              ...prev,
              shopItems: prev.shopItems.filter(i => i.itemId !== itemId),
            }
          : null
      );
    } catch {
      toast.error('Item konnte nicht entfernt werden.');
    }
  };

  const updateItemPriceFn = async (itemId: string, price: number) => {
    if (!user) return;

    try {
      await addPlayerItem(user.id, itemId, price);
      setUser(prev =>
        prev
          ? {
              ...prev,
              shopItems: prev.shopItems.map(i => (i.itemId === itemId ? { ...i, price } : i)),
            }
          : null
      );
    } catch {
      toast.error('Preis konnte nicht aktualisiert werden.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshAuth,
        logout,
        updateProfile: updateProfileFn,
        addItem: addItemFn,
        removeItem: removeItemFn,
        updateItemPrice: updateItemPriceFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}