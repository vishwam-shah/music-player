"use client";
import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Heart,
  Download, Shuffle, Repeat, Repeat1, ListMusic, Maximize2,
  MoreHorizontal, Share2
} from 'lucide-react';
import LyricsPanel from './LyricsPanel';
import QueuePanel from './QueuePanel';
import MusicVisualizer from './MusicVisualizer';

const EnhancedMusicPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    duration,
    currentTime,
    shuffle,
    repeat,
    togglePlay,
    handleNext,
    handlePrevious,
    changeVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    isFavorite
  } = useAudio() as any;

  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      changeVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      changeVolume(0);
      setIsMuted(true);
    }
  };

  const handleDownload = () => {
    if (!currentSong) return;
    // ...download logic...
  };

  // ...existing player rendering logic...
  return null;
};

export default EnhancedMusicPlayer;
