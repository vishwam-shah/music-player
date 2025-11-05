"use client";
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children, songs }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // 'off', 'all', 'one'
  const [favorites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const soundRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize favorites and recently played from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    const storedRecent = localStorage.getItem('recentlyPlayed');
    const storedPlaylists = localStorage.getItem('playlists');

    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    if (storedRecent) setRecentlyPlayed(JSON.parse(storedRecent));
    if (storedPlaylists) setPlaylists(JSON.parse(storedPlaylists));
  }, []);

  // Save to localStorage when favorites or playlists change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

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

  // Load and play song
  const loadSong = useCallback((song, autoPlay = false) => {
    if (!song) return;

    // Clean up previous sound
    if (soundRef.current) {
      soundRef.current.unload();
      clearInterval(intervalRef.current);
    }

    // Add to recently played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      const updated = [song, ...filtered].slice(0, 20);
      return updated;
    });

    // Create new sound
    const newSound = new Howl({
      src: [song.audio],
      html5: true,
      volume: volume,
      onload: function() {
        setDuration(this.duration());
      },
      onplay: function() {
        setIsPlaying(true);
        intervalRef.current = setInterval(() => {
          if (this.playing()) {
            const seek = this.seek();
            const dur = this.duration();
            setCurrentTime(seek);
            setProgress((seek / dur) * 100);
          }
        }, 100);
      },
      onpause: function() {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
      },
      onstop: function() {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        clearInterval(intervalRef.current);
      },
      onend: function() {
        clearInterval(intervalRef.current);
        handleNext();
      }
    });

    soundRef.current = newSound;
    setCurrentSong(song);

    if (autoPlay) {
      newSound.play();
    }
  }, [volume]);

  // Play/Pause toggle
  const togglePlay = useCallback(() => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  }, [isPlaying]);

  // Play next song
  const handleNext = useCallback(() => {
    if (queue.length === 0) return;

    let nextIndex;
    if (repeat === 'one') {
      // Replay current song
      if (soundRef.current) {
        soundRef.current.seek(0);
        soundRef.current.play();
      }
      return;
    } else if (shuffle) {
      // Random next song
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      // Next in queue
      nextIndex = (currentIndex + 1) % queue.length;
    }

    setCurrentIndex(nextIndex);
    loadSong(queue[nextIndex], true);
  }, [queue, currentIndex, shuffle, repeat, loadSong]);

  // Play previous song
  const handlePrevious = useCallback(() => {
    if (queue.length === 0) return;

    // If current time > 3 seconds, restart current song
    if (currentTime > 3) {
      if (soundRef.current) {
        soundRef.current.seek(0);
      }
      return;
    }

    let prevIndex;
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    }

    setCurrentIndex(prevIndex);
    loadSong(queue[prevIndex], true);
  }, [queue, currentIndex, currentTime, shuffle, loadSong]);

  // Change volume
  const changeVolume = useCallback((newVolume) => {
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  }, []);

  // Seek to position
  const seekTo = useCallback((percentage) => {
    if (!soundRef.current || !duration) return;

    const seekTime = (percentage / 100) * duration;
    soundRef.current.seek(seekTime);
    setCurrentTime(seekTime);
    setProgress(percentage);
  }, [duration]);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  // Toggle repeat
  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Add to favorites
  const toggleFavorite = useCallback((song) => {
    setFavorites(prev => {
      const exists = prev.find(s => s.id === song.id);
      if (exists) {
        return prev.filter(s => s.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  }, []);

  // Check if song is favorite
  const isFavorite = useCallback((songId) => {
    return favorites.some(s => s.id === songId);
  }, [favorites]);

  // Set queue and play
  const playQueue = useCallback((songs, startIndex = 0) => {
    setQueue(songs);
    setCurrentIndex(startIndex);
    loadSong(songs[startIndex], true);
  }, [loadSong]);

  // Add to queue
  const addToQueue = useCallback((song) => {
    setQueue(prev => [...prev, song]);
  }, []);

  // Remove from queue
  const removeFromQueue = useCallback((index) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Clear queue
  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentIndex(0);
  }, []);

  // Playlist management
  const createPlaylist = useCallback((name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      songs: [],
      createdAt: new Date().toISOString()
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  }, []);

  const addToPlaylist = useCallback((playlistId, song) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        const exists = playlist.songs.find(s => s.id === song.id);
        if (!exists) {
          return { ...playlist, songs: [...playlist.songs, song] };
        }
      }
      return playlist;
    }));
  }, []);

  const removeFromPlaylist = useCallback((playlistId, songId) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        return { ...playlist, songs: playlist.songs.filter(s => s.id !== songId) };
      }
      return playlist;
    }));
  }, []);

  const deletePlaylist = useCallback((playlistId) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  }, []);

  const value = {
    // State
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

    // Actions
    loadSong,
    togglePlay,
    handleNext,
    handlePrevious,
    changeVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    isFavorite,
    playQueue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
