import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  getCurrentAuth,
  logoutPlayer,
  updatePlayer,
  addPlayerItem,
  removePlayerItem,
  exchangeDevLoginToken,
  ApiPlayer,
} from '@/api/client';
import { toast } from 'sonner';

const DEV_USER_STORAGE_KEY = 'cytomarkt_dev_user';

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
  exchangeLoginToken: (loginToken: string) => Promise<void>;
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

function saveDevUser(user: UserProfile | null) {
  if (!user) {
    localStorage.removeItem(DEV_USER_STORAGE_KEY);
    return;
  }
  localStorage.setItem(DEV_USER_STORAGE_KEY, JSON.stringify(user));
}

function loadDevUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(DEV_USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    localStorage.removeItem(DEV_USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => loadDevUser());
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const result = await getCurrentAuth();

      if (result.authenticated && result.player) {
        const mapped = apiPlayerToProfile(result.player);
        setUser(mapped);
        saveDevUser(mapped);
      } else {
        const fallbackUser = loadDevUser();
        setUser(fallbackUser);
      }
    } catch {
      const fallbackUser = loadDevUser();
      setUser(fallbackUser);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const exchangeLoginToken = async (loginToken: string) => {
    try {
      const result = await exchangeDevLoginToken(loginToken);

      if (result.authenticated && result.player) {
        const mapped = apiPlayerToProfile(result.player);
        setUser(mapped);
        saveDevUser(mapped);
      } else {
        setUser(null);
        saveDevUser(null);
        throw new Error('Token-Austausch war nicht erfolgreich.');
      }
    } catch (err) {
      setUser(null);
      saveDevUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutPlayer();
    } catch {
      // egal
    } finally {
      setUser(null);
      saveDevUser(null);
    }
  };

  const updateProfileFn = async (updates: { shopName?: string; shopCoordinates?: string }) => {
    if (!user) return;

    try {
      await updatePlayer(user.id, {
        shop_name: updates.shopName,
        shop_coordinates: updates.shopCoordinates,
      });

      setUser(prev => {
        const next = prev
          ? {
              ...prev,
              shopName: updates.shopName,
              shopCoordinates: updates.shopCoordinates,
            }
          : null;

        saveDevUser(next);
        return next;
      });
    } catch {
      toast.error('Profil konnte nicht gespeichert werden.');
    }
  };

  const addItemFn = async (itemId: string, price: number) => {
    if (!user) return;

    try {
      await addPlayerItem(user.id, itemId, price);

      setUser(prev => {
        const next = prev
          ? {
              ...prev,
              shopItems: [...prev.shopItems.filter(i => i.itemId !== itemId), { itemId, price }],
            }
          : null;

        saveDevUser(next);
        return next;
      });
    } catch {
      toast.error('Item konnte nicht hinzugefügt werden.');
    }
  };

  const removeItemFn = async (itemId: string) => {
    if (!user) return;

    try {
      await removePlayerItem(user.id, itemId);

      setUser(prev => {
        const next = prev
          ? {
              ...prev,
              shopItems: prev.shopItems.filter(i => i.itemId !== itemId),
            }
          : null;

        saveDevUser(next);
        return next;
      });
    } catch {
      toast.error('Item konnte nicht entfernt werden.');
    }
  };

  const updateItemPriceFn = async (itemId: string, price: number) => {
    if (!user) return;

    try {
      await addPlayerItem(user.id, itemId, price);

      setUser(prev => {
        const next = prev
          ? {
              ...prev,
              shopItems: prev.shopItems.map(i => (i.itemId === itemId ? { ...i, price } : i)),
            }
          : null;

        saveDevUser(next);
        return next;
      });
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
        exchangeLoginToken,
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