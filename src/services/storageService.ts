// Storage Service - IndexedDB operations for playlists, library, and settings
import { openDB, IDBPDatabase } from 'idb';
import type { Song, Playlist, HistoryItem } from '../types';

const DB_NAME = 'vinylPlayerDB';
const DB_VERSION = 1;

interface VinylPlayerDB {
  playlists: {
    key: number;
    value: Playlist;
    indexes: { name: string; createdAt: number };
  };
  library: {
    key: string;
    value: Song & { addedAt: number };
    indexes: { title: string; artist: string; addedAt: number };
  };
  history: {
    key: number;
    value: HistoryItem;
    indexes: { playedAt: number };
  };
  settings: {
    key: string;
    value: { key: string; value: unknown };
  };
  queue: {
    key: number;
    value: Song;
  };
}

class StorageService {
  private db: IDBPDatabase<VinylPlayerDB> | null = null;

  async init(): Promise<IDBPDatabase<VinylPlayerDB>> {
    if (this.db) return this.db;

    this.db = await openDB<VinylPlayerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('playlists')) {
          const playlistStore = db.createObjectStore('playlists', { keyPath: 'id', autoIncrement: true });
          playlistStore.createIndex('name', 'name', { unique: false });
          playlistStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('library')) {
          const libraryStore = db.createObjectStore('library', { keyPath: 'id' });
          libraryStore.createIndex('title', 'title', { unique: false });
          libraryStore.createIndex('artist', 'artist', { unique: false });
          libraryStore.createIndex('addedAt', 'addedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('history')) {
          const historyStore = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
          historyStore.createIndex('playedAt', 'playedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains('queue')) {
          db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
        }
      }
    });

    return this.db;
  }

  // ========== PLAYLISTS ==========

  async createPlaylist(name: string, songs: Song[] = []): Promise<Playlist> {
    await this.init();
    const playlist: Omit<Playlist, 'id'> = {
      name,
      songs,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const id = await this.db!.add('playlists', playlist as Playlist);
    return { ...playlist, id: id as number };
  }

  async getPlaylists(): Promise<Playlist[]> {
    await this.init();
    return this.db!.getAll('playlists');
  }

  async getPlaylist(id: number): Promise<Playlist | undefined> {
    await this.init();
    return this.db!.get('playlists', id);
  }

  async updatePlaylist(id: number, updates: Partial<Playlist>): Promise<Playlist> {
    await this.init();
    const playlist = await this.db!.get('playlists', id);
    if (!playlist) throw new Error('Playlist not found');

    const updated: Playlist = {
      ...playlist,
      ...updates,
      updatedAt: Date.now()
    };
    await this.db!.put('playlists', updated);
    return updated;
  }

  async deletePlaylist(id: number): Promise<void> {
    await this.init();
    await this.db!.delete('playlists', id);
  }

  async addSongToPlaylist(playlistId: number, song: Song): Promise<Playlist> {
    await this.init();
    const playlist = await this.db!.get('playlists', playlistId);
    if (!playlist) throw new Error('Playlist not found');

    playlist.songs.push(song);
    playlist.updatedAt = Date.now();
    await this.db!.put('playlists', playlist);
    return playlist;
  }

  async removeSongFromPlaylist(playlistId: number, songIndex: number): Promise<Playlist> {
    await this.init();
    const playlist = await this.db!.get('playlists', playlistId);
    if (!playlist) throw new Error('Playlist not found');

    playlist.songs.splice(songIndex, 1);
    playlist.updatedAt = Date.now();
    await this.db!.put('playlists', playlist);
    return playlist;
  }

  async reorderPlaylistSongs(playlistId: number, fromIndex: number, toIndex: number): Promise<Playlist> {
    await this.init();
    const playlist = await this.db!.get('playlists', playlistId);
    if (!playlist) throw new Error('Playlist not found');

    const [song] = playlist.songs.splice(fromIndex, 1);
    playlist.songs.splice(toIndex, 0, song);
    playlist.updatedAt = Date.now();
    await this.db!.put('playlists', playlist);
    return playlist;
  }

  // ========== LIBRARY ==========

  async addToLibrary(song: Song): Promise<Song & { addedAt: number }> {
    await this.init();
    const libraryItem = {
      ...song,
      id: song.id || `${song.title}-${song.artist}-${Date.now()}`,
      addedAt: Date.now()
    };
    await this.db!.put('library', libraryItem as Song & { addedAt: number });
    return libraryItem as Song & { addedAt: number };
  }

  async getLibrary(): Promise<(Song & { addedAt: number })[]> {
    await this.init();
    return this.db!.getAll('library');
  }

  async removeFromLibrary(id: string): Promise<void> {
    await this.init();
    await this.db!.delete('library', id);
  }

  async clearLibrary(): Promise<void> {
    await this.init();
    await this.db!.clear('library');
  }

  // ========== HISTORY ==========

  /**
   * Generate a unique fingerprint for a song based on title and artist
   * This ensures the same song from different sources is treated as one
   */
  private generateSongFingerprint(title?: string, artist?: string): string {
    const normalizedTitle = (title || '').toLowerCase().trim().replace(/\s+/g, ' ');
    const normalizedArtist = (artist || '').toLowerCase().trim().replace(/\s+/g, ' ');
    return `${normalizedTitle}::${normalizedArtist}`;
  }

  async addToHistory(song: Song): Promise<HistoryItem> {
    await this.init();
    
    const songFingerprint = this.generateSongFingerprint(song.title, song.artist);
    
    // Find and remove any existing entries with the same fingerprint
    const allHistory = await this.db!.getAll('history');
    const existingItems = allHistory.filter(item => 
      this.generateSongFingerprint(item.title, item.artist) === songFingerprint
    );

    // Remove all existing entries of this song
    for (const existing of existingItems) {
      if (existing.id) {
        await this.db!.delete('history', existing.id as number);
      }
    }

    // Add the song with current timestamp
    const { id: _songId, ...songWithoutId } = song;
    const historyItem = {
      ...songWithoutId,
      songId: song.id,
      playedAt: Date.now()
    } as Omit<HistoryItem, 'id'>;

    try {
      await this.db!.add('history', historyItem as HistoryItem);
    } catch (error) {
      console.warn('Failed to add to history:', error);
    }

    // Keep only last 100 items
    const updatedHistory = await this.db!.getAll('history');
    if (updatedHistory.length > 100) {
      const sorted = updatedHistory.sort((a, b) => a.playedAt - b.playedAt);
      const toDelete = sorted.slice(0, sorted.length - 100);
      for (const item of toDelete) {
        if (item.id) {
          await this.db!.delete('history', item.id as number);
        }
      }
    }

    return historyItem as HistoryItem;
  }

  async getHistory(limit: number = 50): Promise<HistoryItem[]> {
    await this.init();
    const all = await this.db!.getAll('history');
    return all.sort((a, b) => b.playedAt - a.playedAt).slice(0, limit);
  }

  async clearHistory(): Promise<void> {
    await this.init();
    await this.db!.clear('history');
  }

  // ========== SETTINGS ==========

  async setSetting<T>(key: string, value: T): Promise<void> {
    await this.init();
    await this.db!.put('settings', { key, value });
  }

  async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    await this.init();
    const setting = await this.db!.get('settings', key);
    return setting ? (setting.value as T) : defaultValue;
  }

  async getSettings(): Promise<Record<string, unknown>> {
    await this.init();
    const all = await this.db!.getAll('settings');
    return all.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, unknown>);
  }

  // ========== QUEUE ==========

  async saveQueue(songs: Song[]): Promise<void> {
    await this.init();
    await this.db!.clear('queue');
    for (const song of songs) {
      await this.db!.add('queue', song);
    }
  }

  async getQueue(): Promise<Song[]> {
    await this.init();
    return this.db!.getAll('queue');
  }

  async clearQueue(): Promise<void> {
    await this.init();
    await this.db!.clear('queue');
  }
}

const storageService = new StorageService();
export default storageService;
