"use client";

import React, { useState, useContext, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Play,
  Loader2,
  Youtube,
  Clock,
  Eye,
  Music,
  Plus,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { PlayerContext } from "../../context/PlayerContext";
import type { PlayerContextType, Song } from "../../types";

interface YouTubeSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface YouTubeVideo {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
  views: number;
  uploadedAt: string;
  url: string;
}

const YouTubeSearch: React.FC<YouTubeSearchProps> = ({ isOpen, onClose }) => {
  const { playSong, addToQueue } = useContext(PlayerContext) as PlayerContextType;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}&limit=20`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data.results);
    } catch (err) {
      setError((err as Error).message);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePlay = useCallback(
    async (video: YouTubeVideo, addToQueueOnly = false) => {
      setIsLoading(video.id);
      setError(null);

      try {
        // Get the audio stream URL using the improved API
        const response = await fetch(`/api/youtube/stream-v2?id=${video.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get audio");
        }

        // Use proxy URL to bypass CORS restrictions
        const proxyUrl = `/api/youtube/proxy?url=${encodeURIComponent(data.audioUrl)}`;

        // Create a song object compatible with our player
        const song: Song = {
          id: `yt-${video.id}`,
          title: data.title || video.title,
          artist: data.artist || video.artist,
          cover: data.thumbnail || video.thumbnail,
          audio: proxyUrl,
          duration: formatDuration(data.duration),
          source: "youtube",
        };

        if (addToQueueOnly) {
          addToQueue(song);
        } else {
          playSong(song, [song], 0);
          onClose();
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(null);
      }
    },
    [playSong, addToQueue, onClose]
  );

  const formatDuration = (seconds: number): string => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.8)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 flex flex-col rounded-xl overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "2px solid var(--walnut)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center gap-4 p-4 border-b"
              style={{ borderColor: "var(--vinyl-groove)" }}
            >
              <div className="flex items-center gap-2">
                <Youtube size={24} style={{ color: "#FF0000" }} />
                <h2 className="text-xl font-bold" style={{ color: "var(--warm-cream)" }}>
                  YouTube Music
                </h2>
              </div>

              {/* Search input */}
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for songs, artists, or albums..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none"
                  style={{
                    background: "var(--vinyl-groove)",
                    color: "var(--warm-cream)",
                    border: "2px solid var(--walnut)",
                  }}
                  autoFocus
                />
              </div>

              {/* Search button */}
              <button
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="retro-button retro-button-primary flex items-center gap-2"
              >
                {isSearching ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Search size={18} />
                )}
                <span className="hidden sm:inline">Search</span>
              </button>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="mx-4 mt-4 p-3 rounded-lg flex items-center gap-2"
                style={{ background: "var(--danger)", color: "var(--warm-cream)" }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {results.length === 0 && !isSearching && (
                <div
                  className="flex flex-col items-center justify-center h-full text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  <div
                    className="w-20 h-20 rounded-full mb-4 flex items-center justify-center"
                    style={{ background: "var(--vinyl-groove)" }}
                  >
                    <Music size={32} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--warm-cream)" }}>
                    Search YouTube
                  </h3>
                  <p>Find and play any song from YouTube in HD quality</p>
                </div>
              )}

              {isSearching && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="animate-spin" style={{ color: "var(--copper)" }} />
                    <span style={{ color: "var(--text-muted)" }}>Searching YouTube...</span>
                  </div>
                </div>
              )}

              {results.length > 0 && !isSearching && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((video) => (
                    <motion.div
                      key={video.id}
                      className="group relative rounded-lg overflow-hidden cursor-pointer"
                      style={{
                        background: "var(--vinyl-groove)",
                        border: "2px solid transparent",
                      }}
                      whileHover={{
                        borderColor: "var(--copper)",
                        y: -4,
                      }}
                      onClick={() => handlePlay(video)}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video">
                        {video.thumbnail ? (
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: "var(--vinyl-black)" }}
                          >
                            <Music size={32} style={{ color: "var(--text-muted)" }} />
                          </div>
                        )}

                        {/* Duration badge */}
                        <div
                          className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono"
                          style={{ background: "rgba(0,0,0,0.8)", color: "var(--warm-cream)" }}
                        >
                          {video.duration}
                        </div>

                        {/* Play overlay */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "rgba(0,0,0,0.6)" }}
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          {isLoading === video.id ? (
                            <Loader2 size={48} className="animate-spin" style={{ color: "var(--warm-cream)" }} />
                          ) : (
                            <motion.div
                              className="p-4 rounded-full"
                              style={{ background: "var(--burnt-orange)" }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Play size={32} fill="var(--warm-cream)" style={{ color: "var(--warm-cream)" }} />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h4
                          className="font-semibold truncate mb-1"
                          style={{ color: "var(--warm-cream)" }}
                          title={video.title}
                        >
                          {video.title}
                        </h4>
                        <div
                          className="text-sm truncate mb-2"
                          style={{ color: "var(--copper)" }}
                        >
                          {video.artist}
                        </div>
                        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {formatViews(video.views)}
                          </span>
                          {video.uploadedAt && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {video.uploadedAt}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to queue button */}
                      <button
                        className="absolute top-2 right-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "rgba(0,0,0,0.8)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(video, true);
                        }}
                        title="Add to queue"
                      >
                        <Plus size={16} style={{ color: "var(--warm-cream)" }} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer tip */}
            <div
              className="p-3 text-center text-sm border-t"
              style={{ borderColor: "var(--vinyl-groove)", color: "var(--text-muted)" }}
            >
              <span>💡 Tip: Click to play instantly, or click </span>
              <Plus size={14} className="inline" />
              <span> to add to queue</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default YouTubeSearch;
