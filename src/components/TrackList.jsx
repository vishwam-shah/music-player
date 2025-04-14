'use client';

import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import songs from '../data/songs.json';
import { motion } from 'framer-motion';

export default function TrackList({ onSelect }) {
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {songs.map((song, index) => (
        <motion.div
          key={index}
          className="bg-white/10 backdrop-blur-md p-4 rounded-xl cursor-pointer hover:scale-105 transition shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(song)}
        >
          <img
            src={song.cover}
            alt={song.title}
            className="w-full h-40 object-cover rounded-lg"
          />
          <h3 className="text-white font-semibold mt-2">{song.title}</h3>
          <p className="text-indigo-200 text-sm">{song.artist}</p>

          <button
            className="mt-2 text-pink-400 text-sm"
            onClick={(e) => {
              e.stopPropagation(); // prevent click from selecting song
              toggleFavorite(song);
            }}
          >
            {isFavorite(song) ? '💖 Remove from Favorites' : '🤍 Add to Favorites'}
          </button>
        </motion.div>
      ))}
    </div>
  );
}
