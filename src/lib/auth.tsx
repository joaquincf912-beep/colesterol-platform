'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { UserRole } from '@/types';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users for local development
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@colesterol.ve': {
    password: 'admin123',
    user: { id: 'admin-1', email: 'admin@traccionweb.com', full_name: 'Admin traccionweb', role: 'admin' },
  },
  'cocina@colesterol.ve': {
    password: 'cocina123',
    user: { id: 'kitchen-1', email: 'cocina@colesterol.ve', full_name: 'Cocinero', role: 'kitchen', phone: '04141234568' },
  },
  'delivery@colesterol.ve': {
    password: 'delivery123',
    user: { id: 'delivery-1', email: 'delivery@colesterol.ve', full_name: 'Repartidor Demo', role: 'delivery', phone: '04141234569' },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('colesterol_auth');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('colesterol_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    // Try Supabase auth first
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error && data.user) {
        // Fetch user profile from users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', data.user.id)
          .single();

        if (profile) {
          const authUser: User = {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: profile.role,
            phone: profile.phone,
          };
          setUser(authUser);
          localStorage.setItem('colesterol_auth', JSON.stringify(authUser));
          setIsLoading(false);
          return {};
        }
      }
    } catch {
      // Fall through to demo auth
    }

    // Demo mode auth
    const demoEntry = DEMO_USERS[email];
    if (demoEntry && demoEntry.password === password) {
      setUser(demoEntry.user);
      localStorage.setItem('colesterol_auth', JSON.stringify(demoEntry.user));
      setIsLoading(false);
      return {};
    }

    setIsLoading(false);
    return { error: 'Credenciales invalidas' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('colesterol_auth');
    // Also sign out from Supabase
    try {
      const { getSupabaseClient } = require('./supabase/client');
      getSupabaseClient().auth.signOut();
    } catch {
      // Demo mode
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Route protection helper
export function getRequiredRole(pathname: string): UserRole | null {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/pedidos')) return 'kitchen';
  if (pathname.startsWith('/delivery')) return 'delivery';
  return null;
}
