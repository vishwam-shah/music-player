'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import type { Song, FavoritesContextType } from '../types';

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<Song[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (song: Song): void => {
    const exists = favorites.find((fav) => fav.title === song.title);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.title !== song.title));
    } else {
      setFavorites([...favorites, song]);
    }
  };

  const isFavorite = (song: Song): boolean =>
    favorites.some((fav) => fav.title === song.title);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
