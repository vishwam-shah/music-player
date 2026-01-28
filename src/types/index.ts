// Core Types for the Vinyl Music Player

export interface Song {
  id: string | number;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  audio?: string;
  duration?: number | string;
  year?: number;
  genre?: string;
  track?: number;
  bitrate?: number;
  sampleRate?: number;
  isLocal?: boolean;
  isYouTube?: boolean;
  source?: 'local' | 'youtube' | 'stream' | 'jiosaavn';
  fileName?: string;
  fileSize?: number;
  addedAt?: number;
  playedAt?: number;
  audioUrl?: string;
  format?: string;
}

export interface Playlist {
  id: number;
  name: string;
  songs: Song[];
  createdAt: number;
  updatedAt: number;
}

export interface VUData {
  left: number;
  right: number;
  average: number;
  raw?: Uint8Array;
}

export interface EQPresets {
  [key: string]: number[];
}

export type RepeatMode = 'off' | 'one' | 'all';

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  queue: Song[];
  queueIndex: number;
  eqValues: number[];
  currentPreset: string;
  autoEnhance: boolean;
  vuData: VUData;
}

export interface PlayerContextType extends PlayerState {
  playSong: (song: Song, queue?: Song[] | null, index?: number) => void;
  togglePlay: () => void;
  seek: (percent: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setEQBand: (index: number, value: number) => void;
  setPreset: (preset: string) => void;
  toggleAutoEnhance: (enabled: boolean) => void;
  getPresets: () => string[];
  addToQueue: (song: Song, next?: boolean) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  formatTime: (seconds: number) => string;
}

export interface PlaylistContextType {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;
  createPlaylist: (name: string, songs?: Song[]) => Promise<Playlist>;
  deletePlaylist: (id: number) => Promise<void>;
  renamePlaylist: (id: number, newName: string) => Promise<Playlist>;
  addSongToPlaylist: (playlistId: number, song: Song) => Promise<Playlist>;
  removeSongFromPlaylist: (playlistId: number, songIndex: number) => Promise<Playlist>;
  reorderSongs: (playlistId: number, fromIndex: number, toIndex: number) => Promise<Playlist>;
  selectPlaylist: (playlist: Playlist | null) => void;
  duplicatePlaylist: (id: number) => Promise<Playlist | undefined>;
  exportPlaylist: (id: number) => string | null;
  importPlaylist: (jsonString: string) => Promise<Playlist>;
}

export interface FavoritesContextType {
  favorites: Song[];
  toggleFavorite: (song: Song) => void;
  isFavorite: (song: Song) => boolean;
}

export interface YouTubeResult {
  success: boolean;
  title: string;
  artist?: string;
  channel?: string;
  duration?: number;
  thumbnail?: string;
  audioUrl: string;
  cached?: boolean;
  error?: string;
}

export interface HistoryItem extends Song {
  playedAt: number;
}

export interface StorageSettings {
  volume?: number;
  eqPreset?: string;
  autoEnhance?: boolean;
  [key: string]: unknown;
}
