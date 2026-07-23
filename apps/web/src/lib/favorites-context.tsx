'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (garageId: string) => void;
  isFavorite: (garageId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('garage_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load favorites', err);
    }
  }, []);

  const toggleFavorite = (garageId: string) => {
    setFavorites((prev) => {
      let newFavorites;
      if (prev.includes(garageId)) {
        newFavorites = prev.filter((id) => id !== garageId);
      } else {
        newFavorites = [...prev, garageId];
      }
      
      try {
        localStorage.setItem('garage_favorites', JSON.stringify(newFavorites));
      } catch (err) {
        console.error('Failed to save favorites', err);
      }
      
      return newFavorites;
    });
  };

  const isFavorite = (garageId: string) => {
    return favorites.includes(garageId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
