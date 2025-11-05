"use client";
import React, { useState, useEffect } from 'react';
import {
  searchTracks,
  searchHindiSongs,
  searchByArtist,
  getCharts
} from '../services/deezerApi';
import EnhancedTrackList from './EnhancedTrackList';

const DeezerBrowser = ({ viewType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deezerTracks, setDeezerTracks] = useState([]);
  const [chartTracks, setChartTracks] = useState([]);
  const [activeTab, setActiveTab] = useState('charts'); // 'charts', 'search', 'hindi'

  // Load charts on mount
  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCharts();
      if (result.success) {
        setChartTracks(result.tracks);
      } else {
        setError(result.error || 'Failed to load charts. Please check API key.');
      }
    } catch (err) {
      setError('Failed to load charts. Please check your API key and internet connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setActiveTab('search');

    try {
      const result = await searchTracks(searchQuery, 50);
      if (result.success) {
        setDeezerTracks(result.tracks);
        if (result.tracks.length === 0) {
          setError('No results found. Try a different search query.');
        }
      } else {
        setError(result.error || 'Failed to search. Please check API key.');
      }
    } catch (err) {
      setError('Failed to search. Please check your API key and internet connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadHindiSongs = async () => {
    setLoading(true);
    setError(null);
    setActiveTab('hindi');

    try {
      const result = await searchHindiSongs(50);
      if (result.success) {
        setDeezerTracks(result.tracks);
        if (result.tracks.length === 0) {
          setError('No Hindi songs found. The API might be experiencing issues.');
        }
      } else {
        setError(result.error || 'Failed to load Hindi songs. Please check API key.');
      }
    } catch (err) {
      setError('Failed to load Hindi songs. Please check your API key and internet connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickSearches = [
    { label: 'Bollywood Hits', query: 'bollywood' },
    { label: 'Arijit Singh', query: 'arijit singh' },
    { label: 'AR Rahman', query: 'ar rahman' },
    { label: 'Shreya Ghoshal', query: 'shreya ghoshal' },
    { label: 'Electronic', query: 'electronic dance' },
    { label: 'Rock', query: 'rock music' },
    { label: 'Jazz', query: 'jazz' },
    { label: 'Pop', query: 'pop music' },
  ];

  const handleQuickSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    setError(null);
    setActiveTab('search');

    try {
      const result = await searchTracks(query, 50);
      if (result.success) {
        setDeezerTracks(result.tracks);
      } else {
        setError(result.error || 'Failed to search. Please check API key.');
      }
    } catch (err) {
      setError('Failed to search. Please check your API key and internet connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl glass-strong p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 opacity-20"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Deezer Music</h1>
              <p className="text-gray-400">Discover millions of songs</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, albums..."
              className="w-full px-6 py-4 bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <button
          onClick={() => { setActiveTab('charts'); loadCharts(); }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === 'charts'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
              : 'glass text-gray-400 hover:text-white'
          }`}
        >
          Top Charts
        </button>
        <button
          onClick={loadHindiSongs}
          className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === 'hindi'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
              : 'glass text-gray-400 hover:text-white'
          }`}
        >
          Hindi/Bollywood
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === 'search'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
              : 'glass text-gray-400 hover:text-white'
          }`}
        >
          Search Results
        </button>
      </div>

      {/* Quick Searches */}
      {activeTab === 'charts' && !loading && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Quick Searches</h3>
          <div className="flex flex-wrap gap-3">
            {quickSearches.map((item) => (
              <button
                key={item.query}
                onClick={() => handleQuickSearch(item.query)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all hover:scale-105"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="glass-strong rounded-2xl p-6 border-2 border-red-500/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-red-400">API Error</h3>
              <p className="text-sm text-gray-400">{error}</p>
              <p className="text-xs text-gray-500 mt-1">
                Note: RapidAPI key might need renewal. Check the console for details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading from Deezer...</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {activeTab === 'charts' && chartTracks.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Top Charts</h2>
                <span className="text-sm text-gray-400">{chartTracks.length} tracks</span>
              </div>
              <EnhancedTrackList songs={chartTracks} view={viewType} />
            </section>
          )}

          {activeTab === 'search' && deezerTracks.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Search Results</h2>
                <span className="text-sm text-gray-400">{deezerTracks.length} tracks</span>
              </div>
              <EnhancedTrackList songs={deezerTracks} view={viewType} />
            </section>
          )}

          {activeTab === 'hindi' && deezerTracks.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Hindi/Bollywood Songs</h2>
                <span className="text-sm text-gray-400">{deezerTracks.length} tracks</span>
              </div>
              <EnhancedTrackList songs={deezerTracks} view={viewType} />
            </section>
          )}

          {!loading && !error &&
           activeTab === 'search' &&
           deezerTracks.length === 0 &&
           searchQuery && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center opacity-50">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-gray-400">Try searching for something else</p>
            </div>
          )}
        </>
      )}

      {/* Info Card when no content */}
      {!loading && !error && activeTab === 'charts' && chartTracks.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Welcome to Deezer Integration</h3>
          <p className="text-gray-400 mb-4">
            Search for millions of songs or browse Hindi/Bollywood music
          </p>
          <p className="text-sm text-gray-500">
            Note: This feature requires a valid RapidAPI key for Deezer API
          </p>
        </div>
      )}
    </div>
  );
};

export default DeezerBrowser;
