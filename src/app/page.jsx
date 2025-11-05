"use client";
import React, { useState, useEffect } from 'react';
import { AudioProvider } from '../context/AudioContext';
import EnhancedSidebar from '../components/EnhancedSidebar';
import EnhancedHeader from '../components/EnhancedHeader';
import EnhancedTrackList from '../components/EnhancedTrackList';
import EnhancedMusicPlayer from '../components/EnhancedMusicPlayer';
import songsData from '../data/songs.json';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [viewType, setViewType] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ genre: 'all', sortBy: 'recent' });
  const [filteredSongs, setFilteredSongs] = useState(songsData);

  // Enhance songs with additional data
  const enhancedSongs = songsData.map(song => ({
    ...song,
    duration: song.duration || '3:45',
    album: song.album || 'Single',
    genre: song.genre || 'Electronic',
    lyrics: song.lyrics || [
      { time: 0, text: "♪ Instrumental ♪" },
      { time: 5, text: "Music flows through the air" },
      { time: 10, text: "Taking us somewhere far away" },
      { time: 15, text: "In this moment we're free" },
      { time: 20, text: "Lost in the melody" },
      { time: 25, text: "Feel the rhythm in your soul" },
      { time: 30, text: "Let the music take control" },
      { time: 35, text: "♪ Instrumental Break ♪" }
    ]
  }));

  // Filter and search songs
  useEffect(() => {
    let result = enhancedSongs;

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
      result = result.filter(song => song.genre.toLowerCase() === filters.genre.toLowerCase());
    }

    // Sort
    switch (filters.sortBy) {
      case 'title':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'artist':
        result = [...result].sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      case 'popular':
        result = [...result].sort(() => Math.random() - 0.5);
        break;
      default:
        // recent - keep original order
        break;
    }

    setFilteredSongs(result);
  }, [searchQuery, filters]);

  const getMainContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-8 pb-32">
            {/* Hero Section */}
            <section className="relative h-96 rounded-3xl overflow-hidden glass-strong">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 opacity-60"></div>
                <div className="absolute inset-0" style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(2px)'
                }}></div>
              </div>
              <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                <span className="text-sm font-semibold text-violet-300 mb-2">FEATURED PLAYLIST</span>
                <h2 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">Your Perfect Mix</h2>
                <p className="text-lg text-gray-200 mb-6 max-w-2xl">
                  Discover your next favorite song from our curated collection of amazing tracks
                </p>
                <button className="w-fit px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Now
                </button>
              </div>
            </section>

            {/* Recently Played */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Recently Played</h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">
                  See all
                </button>
              </div>
              <EnhancedTrackList songs={enhancedSongs.slice(0, 6)} view={viewType} />
            </section>

            {/* Trending Now */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Trending Now</h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors">
                  See all
                </button>
              </div>
              <EnhancedTrackList songs={enhancedSongs.slice(6, 12)} view={viewType} />
            </section>

            {/* All Songs */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">All Songs</h2>
                <span className="text-sm text-gray-400">{filteredSongs.length} tracks</span>
              </div>
              <EnhancedTrackList songs={filteredSongs} view={viewType} />
            </section>
          </div>
        );

      case 'search':
        return (
          <div className="space-y-8 pb-32">
            <h2 className="text-4xl font-bold gradient-text">Search Results</h2>
            {searchQuery ? (
              <>
                <p className="text-gray-400">
                  Found {filteredSongs.length} results for "{searchQuery}"
                </p>
                <EnhancedTrackList songs={filteredSongs} view={viewType} />
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Search for music</h3>
                <p className="text-gray-400">Find your favorite songs, artists, and albums</p>
              </div>
            )}
          </div>
        );

      case 'library':
        return (
          <div className="space-y-8 pb-32">
            <h2 className="text-4xl font-bold gradient-text">Your Library</h2>
            <EnhancedTrackList songs={enhancedSongs} view={viewType} />
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-8 pb-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10" fill="white" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <div>
                <h2 className="text-4xl font-bold">Liked Songs</h2>
                <p className="text-gray-400">Your favorite tracks</p>
              </div>
            </div>
            <EnhancedTrackList songs={enhancedSongs.slice(0, 10)} view={viewType} />
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
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {getMainContent()}
        </main>
        <EnhancedMusicPlayer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider songs={songsData}>
      <AppContent />
    </AudioProvider>
  );
}
