import React, { useContext, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  Clock,
  Music,
  Grid,
  List,
//   SortAsc,
  FolderOpen,
//   Plus
} from "lucide-react";
import { FavoritesContext } from "../../context/FavoritesContext";
import { PlayerContext } from "../../context/PlayerContext";
import storageService from "../../services/storageService";
import AlbumSleeve, { TrackListItem } from "./AlbumSleeve";
import type { Song } from "../../types";

interface LibraryProps {
  songs?: Song[];
  onAddLocalFiles?: () => void;
}

const Library: React.FC<LibraryProps> = ({ songs = [], onAddLocalFiles }) => {
  const { favorites } = useContext(FavoritesContext) as { favorites: Song[] };
  const { playSong } = useContext(PlayerContext) as { playSong: (song: Song, queue?: Song[], index?: number) => void };

  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [history, setHistory] = useState<Song[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const recentHistory = await storageService.getHistory(20);
      setHistory(recentHistory);
    };
    loadHistory();
  }, []);

  const displayedSongs = useMemo(() => {
    let result: Song[];
    switch (activeTab) {
      case "favorites":
        result = favorites;
        break;
      case "recent":
        result = history.map((h) => ({ ...h, id: h.id }));
        break;
      default:
        result = songs;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (song: Song) =>
          song.title?.toLowerCase().includes(query) ||
          song.artist?.toLowerCase().includes(query)
      );
    }
    result = [...result].sort((a: Song, b: Song) => {
      switch (sortBy) {
        case "artist":
          return (a.artist || "").localeCompare(b.artist || "");
        case "recent":
          return (b.playedAt || b.addedAt || 0) - (a.playedAt || a.addedAt || 0);
        default:
          return (a.title || "").localeCompare(b.title || "");
      }
    });
    return result;
  }, [activeTab, songs, favorites, history, searchQuery, sortBy]);

  const tabs = [
    { id: "all", label: "All Songs", icon: Music, count: songs.length },
    { id: "favorites", label: "Favorites", icon: Heart, count: favorites.length },
    { id: "recent", label: "Recent", icon: Clock, count: history.length }
  ];

  const handlePlayAll = () => {
    if (displayedSongs.length > 0) {
      playSong(displayedSongs[0], displayedSongs, 0);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Your Library
          </h1>
          <button 
            onClick={onAddLocalFiles} 
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:opacity-90"
            style={{
              background: "var(--color-primary)",
              color: "#ffffff",
              border: "2px solid var(--color-primary)"
            }}
          >
            <FolderOpen size={18} />
            <span className="hidden sm:inline">Add Local Files</span>
          </button>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === tab.id ? "" : "hover:opacity-80"
              }`}
              style={{
                background: activeTab === tab.id ? "var(--color-primary)" : "var(--color-surface)",
                border: `2px solid ${activeTab === tab.id ? "var(--color-primary)" : "var(--color-border)"}`,
                color: activeTab === tab.id ? "#ffffff" : "var(--color-text)"
              }}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
              <span 
                className="text-xs px-1.5 py-0.5 rounded-full" 
                style={{ 
                  background: activeTab === tab.id ? "rgba(255,255,255,0.2)" : "var(--color-surfaceHover)",
                  color: activeTab === tab.id ? "#ffffff" : "var(--color-text)"
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        {/* Search and controls */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-textMuted)" }}
            />
            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg outline-none transition-all focus:ring-2"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text)",
                border: "2px solid var(--color-border)"
              }}
            />
          </div>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg outline-none cursor-pointer transition-all hover:opacity-80"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text)",
              border: "2px solid var(--color-border)"
            }}
          >
            <option value="title">Sort by Title</option>
            <option value="artist">Sort by Artist</option>
            <option value="recent">Sort by Recent</option>
          </select>
          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "2px solid var(--color-border)" }}>
            <button
              onClick={() => setViewMode("grid")}
              className="p-2 transition-all hover:opacity-80"
              style={{ 
                background: viewMode === "grid" ? "var(--color-primary)" : "var(--color-surface)",
                color: viewMode === "grid" ? "#ffffff" : "var(--color-text)"
              }}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className="p-2 transition-all hover:opacity-80"
              style={{ 
                background: viewMode === "list" ? "var(--color-primary)" : "var(--color-surface)",
                color: viewMode === "list" ? "#ffffff" : "var(--color-text)"
              }}
            >
              <List size={18} />
            </button>
          </div>
          {/* Play all */}
          {displayedSongs.length > 0 && (
            <button 
              onClick={handlePlayAll} 
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
              style={{
                background: "var(--color-primary)",
                color: "#ffffff",
                border: "2px solid var(--color-primary)"
              }}
            >
              Play All
            </button>
          )}
        </div>
      </div>
      {/* Content - using custom scrollbar from globals.css */}
      <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarGutter: 'stable' }}>
        <AnimatePresence mode="wait">
          {displayedSongs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center" style={{ background: "var(--color-surface)" }}>
                <Music size={40} style={{ color: "var(--color-textMuted)" }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                {searchQuery ? "No results found" : "No songs yet"}
              </h3>
              <p style={{ color: "var(--text-muted)" }}>
                {activeTab === "favorites"
                  ? "Heart some songs to see them here"
                  : activeTab === "recent"
                  ? "Play some tracks to build your history"
                  : "Add local files to get started"}
              </p>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              {displayedSongs.map((song, index) => (
                <AlbumSleeve key={song.id || index} song={song} songs={displayedSongs} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-1"
            >
              {/* List header */}
              <div className="grid grid-cols-12 gap-3 px-2 py-2 text-sm border-b" style={{ color: "var(--text-muted)", borderColor: "var(--vinyl-groove)" }}>
                <div className="col-span-1">#</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-4">Artist</div>
                <div className="col-span-2 text-right">Duration</div>
              </div>
              {displayedSongs.map((song, index) => (
                <TrackListItem key={song.id || index} song={song} songs={displayedSongs} index={index} showNumber />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Library;
