'use client';

import { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(stored);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (song) => {
    const exists = favorites.find((fav) => fav.title === song.title);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.title !== song.title));
    } else {
      setFavorites([...favorites, song]);
    }
  };

  const isFavorite = (song) =>
    favorites.some((fav) => fav.title === song.title);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
