"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode
} from 'react';
import { Howl } from 'howler';

// Define types for Song, Playlist, etc. as needed
export interface Song {
  id: string;
  title: string;
  artist: string;
  cover?: string;
  audioUrl: string;
  [key: string]: any;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  currentTime: number;
  queue: Song[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  favorites: Song[];
  recentlyPlayed: Song[];
  playlists: Playlist[];
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  setQueue: (queue: Song[]) => void;
  setCurrentIndex: (index: number) => void;
  setShuffle: (shuffle: boolean) => void;
  setRepeat: (repeat: 'off' | 'all' | 'one') => void;
  setFavorites: (favorites: Song[]) => void;
  setRecentlyPlayed: (songs: Song[]) => void;
  setPlaylists: (playlists: Playlist[]) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  loadSong: (song: Song, index?: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
  songs?: Song[];
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children, songs = [] }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ...existing useEffects and logic from the jsx file...

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Remove from queue
  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Clear queue
  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentIndex(0);
  }, []);

  // Load song
  const loadSong = useCallback((song: Song, index: number = 0) => {
    setCurrentSong(song);
    setCurrentIndex(index);
    setIsPlaying(true);
  }, []);

  const value: AudioContextType = {
    currentSong,
    isPlaying,
    volume,
    progress,
    duration,
    currentTime,
    queue,
    currentIndex,
    shuffle,
    repeat,
    favorites,
    recentlyPlayed,
    playlists,
    setCurrentSong,
    setIsPlaying,
    setVolume,
    setProgress,
    setDuration,
    setCurrentTime,
    setQueue,
    setCurrentIndex,
    setShuffle,
    setRepeat,
    setFavorites,
    setRecentlyPlayed,
    setPlaylists,
    removeFromQueue,
    clearQueue,
    loadSong
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
