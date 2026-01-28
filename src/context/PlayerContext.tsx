'use client';

import { createContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { Howl } from 'howler';
import audioEngine from '../services/audioEngine';
import storageService from '../services/storageService';
import type { Song, RepeatMode, VUData, PlayerContextType } from '../types';

export const PlayerContext = createContext<PlayerContextType | null>(null);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');

  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const [eqValues, setEqValues] = useState([0, 0, 0, 0, 0]);
  const [currentPreset, setCurrentPreset] = useState('flat');
  const [autoEnhance, setAutoEnhance] = useState(true);
  const [vuData, setVuData] = useState<VUData>({ left: 0, right: 0, average: 0 });

  const soundRef = useRef<Howl | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousVolume = useRef(1);

  useEffect(() => {
    const initAudio = async () => {
      try {
        await audioEngine.init();

        audioEngine.startVUMeter((data) => {
          setVuData(data);
        });

        const savedVolume = await storageService.getSetting('volume', 1);
        const savedPreset = await storageService.getSetting('eqPreset', 'flat');
        const savedAutoEnhance = await storageService.getSetting('autoEnhance', true);

        setVolumeState(savedVolume);
        setCurrentPreset(savedPreset);
        setAutoEnhance(savedAutoEnhance);

        if (savedPreset !== 'flat') {
          audioEngine.setPreset(savedPreset);
          setEqValues(audioEngine.getEQValues());
        }
      } catch (error) {
        console.error('Failed to initialize audio engine:', error);
      }
    };

    initAudio();

    return () => {
      audioEngine.stopVUMeter();
    };
  }, []);

  useEffect(() => {
    if (!currentSong?.audio) return;

    if (soundRef.current) {
      soundRef.current.unload();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Log audio URL and format for debugging
    console.log('Attempting to play audio:', {
      url: currentSong.audio,
      format: currentSong.format || 'unknown',
    });

    const newSound = new Howl({
      src: [currentSong.audio],
      html5: true,
      volume: isMuted ? 0 : volume,
      format: ['mp3', 'mp4', 'webm', 'ogg', 'wav'],
      onload: () => {
        setDuration(newSound.duration());
        // Auto-play after loading
        newSound.play();
      },
      onloaderror: (_id, error) => {
        console.error('Failed to load audio:', error, {
          url: currentSong.audio,
          format: currentSong.format || 'unknown',
        });
        setIsPlaying(false);
        alert('Failed to load audio. This stream may be unavailable or unsupported in your browser.');
      },
      onplayerror: (_id, error) => {
        console.error('Failed to play audio:', error, {
          url: currentSong.audio,
          format: currentSong.format || 'unknown',
        });
        setIsPlaying(false);
        alert('Failed to play audio. This stream may be unavailable or unsupported in your browser.');
        // Try to unlock and play again
        newSound.once('unlock', () => {
          newSound.play();
        });
      },
      onplay: () => {
        setIsPlaying(true);
        if (audioRef.current) {
          try {
            audioEngine.connectSource(audioRef.current);
          } catch (e) {
            console.warn('Could not connect audio engine:', e);
          }
        }
        intervalRef.current = setInterval(() => {
          const seek = newSound.seek() as number;
          setCurrentTime(seek);
          setProgress((seek / newSound.duration()) * 100);
        }, 100);
      },
      onpause: () => {
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      },
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
        handleTrackEnd();
      },
      onstop: () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    });

    soundRef.current = newSound;

    setTimeout(() => {
      const sounds = (newSound as unknown as { _sounds: Array<{ _node: HTMLAudioElement }> })._sounds;
      if (sounds && sounds[0] && sounds[0]._node) {
        audioRef.current = sounds[0]._node;
      }
    }, 100);

    storageService.addToHistory(currentSong);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentSong]);

  const handleTrackEnd = useCallback(() => {
    if (repeat === 'one') {
      soundRef.current?.seek(0);
      soundRef.current?.play();
    } else if (repeat === 'all' || queueIndex < queue.length - 1) {
      playNext();
    }
  }, [repeat, queue, queueIndex]);

  const togglePlay = useCallback(() => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  }, [isPlaying]);

  const playSong = useCallback((song: Song, newQueue: Song[] | null = null, index: number = 0) => {
    if (newQueue) {
      setQueue(newQueue);
      setQueueIndex(index);
    }
    // Always set a new object to force useEffect, even if song is the same
    setCurrentSong(prev => {
      if (!prev || prev.id !== song.id || prev.audio !== song.audio) {
        return song;
      }
      // If same song, force a new object reference
      return { ...song, _forceUpdate: Date.now() } as Song;
    });
  }, []);

  const seek = useCallback((percent: number) => {
    if (!soundRef.current) return;

    const seekTime = (percent / 100) * duration;
    soundRef.current.seek(seekTime);
    setCurrentTime(seekTime);
    setProgress(percent);
  }, [duration]);

  const setVolume = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    setVolumeState(clampedValue);
    setIsMuted(clampedValue === 0);

    if (soundRef.current) {
      soundRef.current.volume(clampedValue);
    }

    audioEngine.setVolume(clampedValue);
    storageService.setSetting('volume', clampedValue);
  }, []);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolumeState(previousVolume.current);
      if (soundRef.current) {
        soundRef.current.volume(previousVolume.current);
      }
    } else {
      previousVolume.current = volume;
      setIsMuted(true);
      setVolumeState(0);
      if (soundRef.current) {
        soundRef.current.volume(0);
      }
    }
  }, [isMuted, volume]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    let nextIndex: number;
    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * queue.length);
      } while (nextIndex === queueIndex && queue.length > 1);
    } else {
      nextIndex = (queueIndex + 1) % queue.length;
    }

    setQueueIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);

    setTimeout(() => {
      soundRef.current?.play();
    }, 100);
  }, [queue, queueIndex, shuffle]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;

    if (currentTime > 3) {
      soundRef.current?.seek(0);
      setCurrentTime(0);
      setProgress(0);
      return;
    }

    const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIndex);
    setCurrentSong(queue[prevIndex]);

    setTimeout(() => {
      soundRef.current?.play();
    }, 100);
  }, [queue, queueIndex, currentTime]);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeat(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const setEQBand = useCallback((index: number, value: number) => {
    audioEngine.setEQBand(index, value);
    setEqValues(audioEngine.getEQValues());
    setCurrentPreset('custom');
  }, []);

  const setPreset = useCallback((preset: string) => {
    audioEngine.setPreset(preset);
    setCurrentPreset(preset);
    setEqValues(audioEngine.getEQValues());
    storageService.setSetting('eqPreset', preset);
  }, []);

  const toggleAutoEnhance = useCallback((enabled: boolean) => {
    setAutoEnhance(enabled);
    audioEngine.toggleAutoEnhance(enabled);
    storageService.setSetting('autoEnhance', enabled);
  }, []);

  const addToQueue = useCallback((song: Song, next: boolean = false) => {
    setQueue(prev => {
      if (next) {
        return [...prev.slice(0, queueIndex + 1), song, ...prev.slice(queueIndex + 1)];
      }
      return [...prev, song];
    });
  }, [queueIndex]);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  }, [queueIndex]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setQueueIndex(0);
  }, []);

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const value: PlayerContextType = {
    currentSong,
    isPlaying,
    progress,
    duration,
    currentTime,
    volume,
    isMuted,
    shuffle,
    repeat,
    queue,
    queueIndex,
    eqValues,
    currentPreset,
    autoEnhance,
    vuData,
    playSong,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    playNext,
    playPrevious,
    toggleShuffle,
    cycleRepeat,
    setEQBand,
    setPreset,
    toggleAutoEnhance,
    getPresets: () => audioEngine.getPresets(),
    addToQueue,
    removeFromQueue,
    clearQueue,
    formatTime
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
