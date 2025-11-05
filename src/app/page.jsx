"use client";
import React, { useState, useEffect } from 'react';
import { AudioProvider } from '../context/AudioContext';
import EnhancedSidebar from '../components/EnhancedSidebar';
import EnhancedHeader from '../components/EnhancedHeader';
import EnhancedTrackList from '../components/EnhancedTrackList';
import EnhancedMusicPlayer from '../components/EnhancedMusicPlayer';
import MusicAPIService from '../services/MusicAPIService';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [viewType, setViewType] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ genre: 'all', sortBy: 'recent' });
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch music on mount
  useEffect(() => {
    const loadMusic = async () => {
      setLoading(true);
      try {
        const tracks = await MusicAPIService.fetchTracks(50);
        setSongs(tracks);
        setFilteredSongs(tracks);
      } catch (error) {
        console.error('Error loading music:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMusic();
  }, []);

  // Filter and search songs
  useEffect(() => {
    let result = [...songs];

    // Search filter
    if (searchQuery) {
      result = result.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (song.album && song.album.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Genre filter
    if (filters.genre !== 'all') {
      result = result.filter(song =>
        song.genre.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'artist':
        result.sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      case 'popular':
        result.sort(() => Math.random() - 0.5);
        break;
      default:
        // recent - keep original order
        break;
    }

    setFilteredSongs(result);
  }, [searchQuery, filters, songs]);

  const getMainContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-2xl font-semibold text-contrast">Loading amazing music...</p>
            <p className="text-muted-contrast">Fetching fresh tracks for you</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-12 pb-32">
            {/* Hero Section */}
            <section className="relative h-[500px] rounded-3xl overflow-hidden glass-modal">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 opacity-70"></div>
                <div className="absolute inset-0" style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1400&h=600&fit=crop&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(1px)'
                }}></div>
              </div>
              <div className="relative h-full flex flex-col justify-end space-luxury-lg">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 rounded-full w-fit backdrop-blur-md">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-white">LIVE NOW - FREE MUSIC</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-bold mb-6 text-contrast">
                  Your Ultimate
                  <span className="block gradient-text">Music Experience</span>
                </h2>
                <p className="text-xl text-gray-100 mb-8 max-w-3xl leading-relaxed">
                  Stream unlimited music for free. No subscriptions, no ads, just pure musical bliss.
                  Download your favorites and enjoy offline.
                </p>
                <div className="flex gap-4">
                  <button className="btn-luxury text-white flex items-center gap-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play All ({songs.length} Tracks)
                  </button>
                  <button className="px-8 py-4 glass-strong rounded-full font-semibold hover:bg-white/20 transition-all text-white">
                    Explore Genres
                  </button>
                </div>
              </div>
            </section>

            {/* Trending Now */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-contrast mb-2">🔥 Trending Now</h2>
                  <p className="text-muted-contrast">Most popular tracks right now</p>
                </div>
                <button className="text-sm text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                  View All →
                </button>
              </div>
              <EnhancedTrackList songs={songs.slice(0, 6)} view={viewType} />
            </section>

            {/* Fresh Releases */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-contrast mb-2">✨ Fresh Releases</h2>
                  <p className="text-muted-contrast">Latest additions to our collection</p>
                </div>
                <button className="text-sm text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                  View All →
                </button>
              </div>
              <EnhancedTrackList songs={songs.slice(6, 12)} view={viewType} />
            </section>

            {/* All Tracks */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-contrast mb-2">🎵 All Tracks</h2>
                  <p className="text-muted-contrast">{filteredSongs.length} songs available</p>
                </div>
              </div>
              <EnhancedTrackList songs={filteredSongs} view={viewType} />
            </section>
          </div>
        );

      case 'search':
        return (
          <div className="space-y-8 pb-32">
            <div className="space-luxury glass-modal rounded-3xl">
              <h2 className="text-5xl font-bold gradient-text mb-4">Search Results</h2>
              {searchQuery ? (
                <p className="text-xl text-muted-contrast">
                  Found {filteredSongs.length} tracks matching "{searchQuery}"
                </p>
              ) : (
                <p className="text-xl text-muted-contrast">
                  Start typing to search for songs, artists, or albums
                </p>
              )}
            </div>

            {searchQuery && filteredSongs.length > 0 ? (
              <EnhancedTrackList songs={filteredSongs} view={viewType} />
            ) : searchQuery && filteredSongs.length === 0 ? (
              <div className="text-center py-20 space-luxury glass-modal rounded-3xl">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center opacity-20">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold mb-3">No tracks found</h3>
                <p className="text-muted-contrast text-lg">Try a different search term</p>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center glow-strong">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold mb-3">Discover Your Next Favorite</h3>
                <p className="text-muted-contrast text-lg">Search for songs, artists, or albums</p>
              </div>
            )}
          </div>
        );

      case 'library':
        return (
          <div className="space-y-8 pb-32">
            <div className="space-luxury glass-modal rounded-3xl">
              <h2 className="text-5xl font-bold gradient-text mb-4">Your Library</h2>
              <p className="text-xl text-muted-contrast">All your saved music in one place</p>
            </div>
            <EnhancedTrackList songs={songs} view={viewType} />
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-8 pb-32">
            <div className="flex items-center gap-6 space-luxury glass-modal rounded-3xl">
              <div className="w-28 h-28 bg-gradient-to-br from-pink-500 via-purple-600 to-violet-600 rounded-3xl flex items-center justify-center glow-strong">
                <svg className="w-14 h-14 text-white" fill="white" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div>
                <h2 className="text-5xl font-bold text-contrast mb-2">Liked Songs</h2>
                <p className="text-xl text-muted-contrast">Your favorite tracks collection</p>
              </div>
            </div>
            <EnhancedTrackList songs={songs.slice(0, 15)} view={viewType} />
          </div>
        );

      default:
        return (
          <div className="space-y-8 pb-32">
            <EnhancedTrackList songs={filteredSongs} view={viewType} />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <EnhancedSidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col min-w-0">
        <EnhancedHeader
          onSearch={setSearchQuery}
          view={viewType}
          onViewChange={setViewType}
          onFilterChange={setFilters}
        />
        <main className="flex-1 overflow-y-auto scroll-container">
          <div className="container-luxury py-8">
            {getMainContent()}
          </div>
        </main>
        <EnhancedMusicPlayer />
      </div>
    </div>
  );
}

export default function App() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const loadMusic = async () => {
      try {
        const tracks = await MusicAPIService.fetchTracks(50);
        setSongs(tracks);
      } catch (error) {
        console.error('Error loading music:', error);
      }
    };

    loadMusic();
  }, []);

  return (
    <AudioProvider songs={songs}>
      <AppContent />
    </AudioProvider>
  );
}
