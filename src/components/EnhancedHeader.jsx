"use client";
import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, Grid, List, SlidersHorizontal } from 'lucide-react';

export default function EnhancedHeader({ onSearch, view, onViewChange, onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: 'all',
    sortBy: 'recent',
  });

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-4 p-4 md:p-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-violet-400 transition-colors" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for songs, artists, or albums..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSearch('');
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="hidden md:flex items-center gap-2 glass rounded-full p-1">
          <button
            onClick={() => onViewChange('grid')}
            className={`p-2 rounded-full transition-all ${
              view === 'grid'
                ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`p-2 rounded-full transition-all ${
              view === 'list'
                ? 'bg-gradient-to-br from-violet-500 to-pink-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>

        {/* Filters */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 glass rounded-full hover:glass-strong transition-all ${
              showFilters ? 'text-violet-400' : 'text-gray-400 hover:text-white'
            }`}
            title="Filters"
          >
            <SlidersHorizontal size={20} />
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-64 glass-strong rounded-2xl shadow-xl p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                >
                  <option value="all">All Genres</option>
                  <option value="pop">Pop</option>
                  <option value="rock">Rock</option>
                  <option value="electronic">Electronic</option>
                  <option value="jazz">Jazz</option>
                  <option value="classical">Classical</option>
                  <option value="hiphop">Hip Hop</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                >
                  <option value="recent">Recently Added</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="artist">Artist (A-Z)</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setFilters({ genre: 'all', sortBy: 'recent' });
                  onFilterChange({ genre: 'all', sortBy: 'recent' });
                }}
                className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="hidden md:block p-3 glass rounded-full hover:glass-strong transition-all relative">
          <Bell size={20} className="text-gray-400 hover:text-white transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <button className="hidden md:flex items-center gap-2 glass rounded-full pl-2 pr-4 py-2 hover:glass-strong transition-all">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center">
            <User size={18} />
          </div>
          <span className="text-sm font-medium">Guest</span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
