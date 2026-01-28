"use client";
import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import {
  Home, Search, Library, Heart, Clock, ListMusic, Plus,
  Music, TrendingUp, Radio, Sparkles, Menu, X, Music2
} from 'lucide-react';

export default function EnhancedSidebar({ currentView, onViewChange }) {
  const { playlists, favorites, recentlyPlayed, createPlaylist } = useAudio();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', badge: null },
    { id: 'search', icon: Search, label: 'Search', badge: null },
    { id: 'library', icon: Library, label: 'Your Library', badge: null },
  ];

  const collections = [
    { id: 'deezer', icon: Music2, label: 'Deezer Music', badge: null, color: 'text-orange-500' },
    { id: 'favorites', icon: Heart, label: 'Liked Songs', badge: favorites.length, color: 'text-pink-500' },
    { id: 'recent', icon: Clock, label: 'Recently Played', badge: recentlyPlayed.length, color: 'text-blue-500' },
    { id: 'trending', icon: TrendingUp, label: 'Trending', badge: null, color: 'text-green-500' },
    { id: 'radio', icon: Radio, label: 'Radio', badge: null, color: 'text-purple-500' },
    { id: 'discover', icon: Sparkles, label: 'Discover', badge: null, color: 'text-yellow-500' },
  ];

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 glass-strong rounded-full"
      >
        {isCollapsed ? <Menu size={24} /> : <X size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-40 glass-strong border-r border-white/10 transition-transform duration-300 flex flex-col ${
          isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center glow">
              <Music className="text-white" size={24} />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold gradient-text">MusicWave</h1>
                <p className="text-xs text-gray-400">Futuristic Player</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Main Menu */}
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={24} className={isActive ? 'text-violet-400' : ''} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      {item.badge !== null && (
                        <span className="px-2 py-1 bg-violet-500/20 rounded-full text-xs">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Collections */}
          {!isCollapsed && (
            <div className="mt-6">
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Collections
              </h3>
              <div className="space-y-1">
                {collections.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={20} className={item.color} />
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {item.badge !== null && item.badge > 0 && (
                        <span className="text-xs text-gray-500">{item.badge}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Playlists */}
          {!isCollapsed && (
            <div className="mt-6">
              <div className="flex items-center justify-between px-4 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Playlists
                </h3>
                <button
                  onClick={() => setShowCreatePlaylist(true)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Create Playlist"
                >
                  <Plus size={16} />
                </button>
              </div>

              {showCreatePlaylist && (
                <div className="px-4 mb-2">
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
                    onBlur={handleCreatePlaylist}
                    placeholder="Playlist name"
                    autoFocus
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              )}

              <div className="space-y-1">
                {playlists.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500">No playlists yet</p>
                ) : (
                  playlists.map((playlist) => {
                    const isActive = currentView === `playlist-${playlist.id}`;

                    return (
                      <button
                        key={playlist.id}
                        onClick={() => onViewChange(`playlist-${playlist.id}`)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all group ${
                          isActive
                            ? 'bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <ListMusic size={16} />
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm truncate">{playlist.name}</p>
                          <p className="text-xs text-gray-500">{playlist.songs.length} songs</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="glass rounded-lg p-4">
              <h4 className="font-semibold mb-1 text-sm">Premium Sound</h4>
              <p className="text-xs text-gray-400 mb-3">Upgrade for unlimited downloads</p>
              <button className="w-full py-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center text-white hover:bg-violet-600 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
