"use client";
import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, Heart, Plus, MoreVertical, ListPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Song } from '../context/AudioContext';

interface EnhancedTrackListProps {
  songs: Song[];
  view?: 'grid' | 'list';
}

const EnhancedTrackList: React.FC<EnhancedTrackListProps> = ({ songs, view = 'grid' }) => {
  const {
    currentSong,
    isPlaying,
    playQueue,
    loadSong,
    toggleFavorite,
    isFavorite,
    addToQueue,
    playlists,
    addToPlaylist
  } = useAudio() as any;

  const [hoveredSong, setHoveredSong] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const handlePlaySong = (song: Song, index: number) => {
    if (currentSong?.id === song.id) {
      // If same song, just playQueue again or do nothing
      playQueue(songs, index);
    } else {
      playQueue(songs, index);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (view === 'list') {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        {songs.map((song, index) => {
          const isCurrentSong = currentSong?.id === song.id;
          const isHovered = hoveredSong === song.id;
          // ...existing list view rendering logic...
          return null;
        })}
      </motion.div>
    );
  }

  // ...existing grid view rendering logic...
  return null;
};

export default EnhancedTrackList;
