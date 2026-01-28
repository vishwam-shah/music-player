"use client";

import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Heart, Music2, Loader2, X } from "lucide-react";
import Image from "next/image";
import { PlayerContext } from "../../context/PlayerContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import type { PlayerContextType, FavoritesContextType, Song } from "../../types";

interface JioSaavnResult {
  id: string;
  title: string;
  artist: string;
  duration: number;
  thumbnail: string;
  album?: string;
  year?: string;
  language?: string;
  url?: string;
}

const JioSaavnSearch: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<JioSaavnResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { playSong, currentSong, isPlaying } = useContext(PlayerContext) as PlayerContextType;
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext) as FavoritesContextType;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/jiosaavn/search?q=${encodeURIComponent(searchQuery)}&limit=20`
      );
      const data = await response.json();

      if (data.success) {
        setResults(data.items || []);
      } else {
        setError(data.error || "Failed to search");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("JioSaavn search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async (result: JioSaavnResult) => {
    try {
      // Get streaming URL
      const response = await fetch(`/api/jiosaavn/stream?id=${result.id}`);
      const data = await response.json();

      if (data.success && data.audioUrl) {
        const song: Song = {
          id: result.id,
          title: result.title,
          artist: result.artist,
          audioUrl: data.audioUrl,
          audio: data.audioUrl,
          cover: result.thumbnail,
          duration: result.duration,
          album: result.album,
          source: "jiosaavn",
        };

        playSong(song, [song], 0);
      } else {
        console.error("Failed to get stream URL:", data.error);
      }
    } catch (err) {
      console.error("Error playing song:", err);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-3">
          <Music2 size={24} style={{ color: "var(--color-primary)" }} />
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
            JioSaavn
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all hover:opacity-80"
            style={{ color: "var(--color-textMuted)" }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-textMuted)" }}
          />
          <input
            type="text"
            placeholder="Search songs on JioSaavn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text)",
              border: "2px solid var(--color-border)",
            }}
          />
          {searchQuery && (
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background: "var(--color-primary)",
                color: "#ffffff",
              }}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Search"}
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 p-3 rounded-lg" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
          {error}
        </div>
      )}

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <Loader2 size={40} className="animate-spin" style={{ color: "var(--color-primary)" }} />
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {results.map((result) => {
                const isCurrentSong = currentSong?.id === result.id;
                const isLiked = isFavorite({
                  id: result.id,
                  title: result.title,
                  artist: result.artist,
                  audio: "",
                  cover: result.thumbnail,
                });

                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:opacity-90"
                    style={{
                      background: isCurrentSong ? "var(--color-surfaceHover)" : "var(--color-surface)",
                      border: `2px solid ${isCurrentSong ? "var(--color-primary)" : "var(--color-border)"}`,
                    }}
                    onClick={() => handlePlay(result)}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      {result.thumbnail ? (
                        <Image
                          src={result.thumbnail}
                          alt={result.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: "var(--color-surfaceHover)" }}
                        >
                          <Music2 size={24} style={{ color: "var(--color-textMuted)" }} />
                        </div>
                      )}
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={20} fill="#ffffff" style={{ color: "#ffffff" }} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-medium truncate"
                        style={{ color: isCurrentSong ? "var(--color-primary)" : "var(--color-text)" }}
                      >
                        {result.title}
                      </div>
                      <div className="text-sm truncate" style={{ color: "var(--color-textMuted)" }}>
                        {result.artist}
                      </div>
                      {result.album && (
                        <div className="text-xs truncate" style={{ color: "var(--color-textMuted)" }}>
                          {result.album} {result.year ? `• ${result.year}` : ""}
                        </div>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="text-sm font-mono" style={{ color: "var(--color-textMuted)" }}>
                      {formatDuration(result.duration)}
                    </div>

                    {/* Favorite */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite({
                          id: result.id,
                          title: result.title,
                          artist: result.artist,
                          audio: "",
                          cover: result.thumbnail,
                          source: "jiosaavn",
                        });
                      }}
                      className="p-2 rounded-full transition-all hover:scale-110"
                    >
                      <Heart
                        size={18}
                        fill={isLiked ? "#ef4444" : "none"}
                        style={{ color: isLiked ? "#ef4444" : "var(--color-textMuted)" }}
                      />
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : searchQuery ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <Music2 size={48} style={{ color: "var(--color-textMuted)" }} className="mb-4" />
              <p style={{ color: "var(--color-text)" }}>No results found</p>
              <p className="text-sm" style={{ color: "var(--color-textMuted)" }}>
                Try a different search term
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <Music2 size={48} style={{ color: "var(--color-primary)" }} className="mb-4" />
              <p style={{ color: "var(--color-text)" }}>Search for songs on JioSaavn</p>
              <p className="text-sm" style={{ color: "var(--color-textMuted)" }}>
                High-quality music streaming
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JioSaavnSearch;
