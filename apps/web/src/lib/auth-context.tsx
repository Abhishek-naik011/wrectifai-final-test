'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email?: string;
  name?: string;
  garageName?: string;
  roles: string[];
  mobileNumber?: string;
  status?: string;
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken?: string, user?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
        // Fetch current user from HttpOnly cookie session
        const res = await fetch(`${baseUrl}/auth/me`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.user && mounted) {
            setUser(json.data.user);
            setIsAuthenticated(true);
          }
        } else {
          // No fallback to localStorage since we use HttpOnly cookies.
          if (mounted) {
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        // Handle network failures gracefully without throwing
        console.warn('[AuthContext] Auth initialization network request failed or was aborted. Defaulting to unauthenticated state.');
        if (mounted) {
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    return () => { mounted = false; };
  }, []);

  // Listen to silent refresh logout events
  useEffect(() => {
    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, []);

  const login = useCallback((accessToken: string, refreshToken?: string, userData?: User) => {
    let resolvedUser = userData || null;

    if (!resolvedUser) {
      const decoded = decodeJwt(accessToken);
      if (decoded) {
        resolvedUser = {
          id: decoded.userId,
          email: decoded.email,
          roles: decoded.roles,
          name: decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'User'),
        };
      }
    }

    setUser(resolvedUser);
    setToken(accessToken);
    setIsAuthenticated(true);

    // Architectural fix: Since the backend API (.onrender.com) and frontend (.vercel.app)
    // are on different domains, HttpOnly cookies set by the backend are NOT sent to the 
    // Next.js server during navigation. We must sync the token to the frontend domain 
    // so middleware.ts can read it.
    if (typeof window !== 'undefined') {
      document.cookie = `accessToken=${accessToken}; path=/; max-age=604800; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`;
      if (refreshToken) {
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`;
      }
    }
  }, []);

  const logout = useCallback(async () => {
    if (typeof window !== 'undefined') {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
        await fetch(`${baseUrl}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.warn('Logout API failed', err);
      }
      
      // Clear any app-specific cached data for complete session isolation
      for (const key of Object.keys(localStorage)) {
        if (
          key.startsWith('wrectifai_') ||
          key === 'garage_favorites'
        ) {
          localStorage.removeItem(key);
        }
      }
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // Redirect to public homepage on logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
