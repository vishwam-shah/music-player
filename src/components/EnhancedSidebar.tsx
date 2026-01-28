"use client";
import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import {
  Home, Search, Library, Heart, Clock, ListMusic, Plus,
  Music, TrendingUp, Radio, Sparkles, Menu, X, Music2
} from 'lucide-react';

interface EnhancedSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const EnhancedSidebar: React.FC<EnhancedSidebarProps> = ({ currentView, onViewChange }) => {
  const { playlists, favorites, recentlyPlayed, createPlaylist } = useAudio() as any;
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

  // ...existing sidebar rendering logic...
  return null;
};

export default EnhancedSidebar;
