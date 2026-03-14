import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserShopItem {
  itemId: string;
  price: number;
}

export interface UserProfile {
  username: string;
  shopName?: string;
  shopCoordinates?: string;
  shopItems: UserShopItem[];
  joinedAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (username: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = 'cytomarkt_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  const login = (username: string) => {
    // Check if user already exists
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      const existing = JSON.parse(stored) as UserProfile;
      if (existing.username === username) {
        setUser(existing);
        return;
      }
    }
    const profile: UserProfile = {
      username: username.trim(),
      shopItems: [],
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setUser(profile);
  };

  const logout = () => setUser(null);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
