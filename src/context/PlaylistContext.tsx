'use client';

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import storageService from '../services/storageService';
import type { Song, Playlist, PlaylistContextType } from '../types';

export const PlaylistContext = createContext<PlaylistContextType | null>(null);

interface PlaylistProviderProps {
  children: ReactNode;
}

export const PlaylistProvider = ({ children }: PlaylistProviderProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const stored = await storageService.getPlaylists();
        setPlaylists(stored);
      } catch (error) {
        console.error('Failed to load playlists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaylists();
  }, []);

  const createPlaylist = useCallback(async (name: string, songs: Song[] = []): Promise<Playlist> => {
    try {
      const newPlaylist = await storageService.createPlaylist(name, songs);
      setPlaylists(prev => [...prev, newPlaylist]);
      return newPlaylist;
    } catch (error) {
      console.error('Failed to create playlist:', error);
      throw error;
    }
  }, []);

  const deletePlaylist = useCallback(async (id: number): Promise<void> => {
    try {
      await storageService.deletePlaylist(id);
      setPlaylists(prev => prev.filter(p => p.id !== id));
      if (currentPlaylist?.id === id) {
        setCurrentPlaylist(null);
      }
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      throw error;
    }
  }, [currentPlaylist]);

  const renamePlaylist = useCallback(async (id: number, newName: string): Promise<Playlist> => {
    try {
      const updated = await storageService.updatePlaylist(id, { name: newName });
      setPlaylists(prev => prev.map(p => p.id === id ? updated : p));
      if (currentPlaylist?.id === id) {
        setCurrentPlaylist(updated);
      }
      return updated;
    } catch (error) {
      console.error('Failed to rename playlist:', error);
      throw error;
    }
  }, [currentPlaylist]);

  const addSongToPlaylist = useCallback(async (playlistId: number, song: Song): Promise<Playlist> => {
    try {
      const updated = await storageService.addSongToPlaylist(playlistId, song);
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updated : p));
      if (currentPlaylist?.id === playlistId) {
        setCurrentPlaylist(updated);
      }
      return updated;
    } catch (error) {
      console.error('Failed to add song to playlist:', error);
      throw error;
    }
  }, [currentPlaylist]);

  const removeSongFromPlaylist = useCallback(async (playlistId: number, songIndex: number): Promise<Playlist> => {
    try {
      const updated = await storageService.removeSongFromPlaylist(playlistId, songIndex);
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updated : p));
      if (currentPlaylist?.id === playlistId) {
        setCurrentPlaylist(updated);
      }
      return updated;
    } catch (error) {
      console.error('Failed to remove song from playlist:', error);
      throw error;
    }
  }, [currentPlaylist]);

  const reorderSongs = useCallback(async (playlistId: number, fromIndex: number, toIndex: number): Promise<Playlist> => {
    try {
      const updated = await storageService.reorderPlaylistSongs(playlistId, fromIndex, toIndex);
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updated : p));
      if (currentPlaylist?.id === playlistId) {
        setCurrentPlaylist(updated);
      }
      return updated;
    } catch (error) {
      console.error('Failed to reorder songs:', error);
      throw error;
    }
  }, [currentPlaylist]);

  const selectPlaylist = useCallback((playlist: Playlist | null): void => {
    setCurrentPlaylist(playlist);
  }, []);

  const duplicatePlaylist = useCallback(async (id: number): Promise<Playlist | undefined> => {
    const playlist = playlists.find(p => p.id === id);
    if (!playlist) return;

    return createPlaylist(`${playlist.name} (Copy)`, [...playlist.songs]);
  }, [playlists, createPlaylist]);

  const exportPlaylist = useCallback((id: number): string | null => {
    const playlist = playlists.find(p => p.id === id);
    if (!playlist) return null;

    const exportData = {
      name: playlist.name,
      songs: playlist.songs.map(s => ({
        title: s.title,
        artist: s.artist,
        audio: s.audio
      })),
      exportedAt: new Date().toISOString()
    };

    return JSON.stringify(exportData, null, 2);
  }, [playlists]);

  const importPlaylist = useCallback(async (jsonString: string): Promise<Playlist> => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.name || !Array.isArray(data.songs)) {
        throw new Error('Invalid playlist format');
      }

      return createPlaylist(data.name, data.songs);
    } catch (error) {
      console.error('Failed to import playlist:', error);
      throw error;
    }
  }, [createPlaylist]);

  const value: PlaylistContextType = {
    playlists,
    currentPlaylist,
    isLoading,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    reorderSongs,
    selectPlaylist,
    duplicatePlaylist,
    exportPlaylist,
    importPlaylist
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};
