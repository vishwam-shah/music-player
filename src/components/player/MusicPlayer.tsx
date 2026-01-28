"use client";

import React, { useContext, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Heart,
  Maximize2,
} from "lucide-react";
import Image from "next/image";
import { PlayerContext } from "../../context/PlayerContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import { VolumeSlider } from "./VolumeKnob";
import { CompactVUMeter } from "./VUMeter";
import RetroEqualizer from "./RetroEqualizer";
import VisualEqualizer from "./VisualEqualizer";
import NowPlayingQueue from "../queue/NowPlayingQueue";
import type { PlayerContextType, FavoritesContextType } from "../../types";

const MusicPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    shuffle,
    repeat,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    cycleRepeat,
    seek,
    formatTime,
  } = useContext(PlayerContext) as PlayerContextType;

  const { toggleFavorite, isFavorite } = useContext(FavoritesContext) as FavoritesContextType;

  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const isLiked = currentSong ? isFavorite(currentSong) : false;

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      seek(Math.max(0, Math.min(100, percent)));
    },
    [seek]
  );

  const handleProgressDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.buttons !== 1) return;
      handleProgressClick(e);
    },
    [handleProgressClick]
  );

  if (!currentSong) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-2xl"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "0 -10px 40px var(--color-shadow)",
        }}
      >
        <div className="p-6 flex items-center justify-center" style={{ color: "var(--color-textMuted)" }}>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Select a song to play
          </motion.span>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-2xl"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "0 -10px 40px var(--color-shadow)",
        }}
      >
        {/* Progress bar at top */}
        <div
          ref={progressBarRef}
          className="relative h-1.5 cursor-pointer group"
          style={{ background: "var(--color-border)" }}
          onClick={handleProgressClick}
          onMouseMove={handleProgressDrag}
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
        >
          {/* Progress fill */}
          <motion.div
            className="absolute left-0 top-0 h-full transition-shadow duration-300"
            style={{
              background: "var(--color-primary)",
              boxShadow: isHoveringProgress ? `0 0 20px var(--color-primary)` : "none",
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
          {/* Hover expand effect */}
          <motion.div
            className="absolute inset-0"
            animate={{ scaleY: isHoveringProgress ? 2 : 1 }}
            style={{ transformOrigin: "bottom", background: "transparent" }}
          />
          {/* Scrubber thumb */}
          <AnimatePresence>
            {isHoveringProgress && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                style={{
                  left: `${progress}%`,
                  marginLeft: -8,
                  background: "var(--color-primary)",
                  boxShadow: `0 0 12px var(--color-primary), 0 0 24px var(--color-primary)`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Song info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Album art with glow effect */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="relative w-16 h-16 rounded-xl overflow-hidden border-2"
                  style={{
                    borderColor: "var(--color-primary)",
                    boxShadow: `0 0 20px var(--color-shadow)`,
                  }}
                  animate={{
                    boxShadow: isPlaying
                      ? `0 0 30px var(--color-primary)`
                      : `0 0 20px var(--color-shadow)`,
                    rotate: isPlaying ? 360 : 0,
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                    rotate: isPlaying ? { duration: 8, repeat: Infinity, ease: "linear" } : {},
                  }}
                >
                  <Image
                    src={currentSong.cover || "/default.jpg"}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                    fill
                    sizes="56px"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ boxShadow: "inset 0 0 15px rgba(0,0,0,0.5)" }}
                  />
                </motion.div>
                {/* Expand button on hover */}
                <button
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                >
                  <Maximize2 size={16} style={{ color: "var(--warm-cream)" }} />
                </button>
              </motion.div>

              {/* Song details */}
              <div className="flex-1 min-w-0 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold truncate"
                      style={{ color: "var(--warm-cream)" }}
                    >
                      {currentSong.title}
                    </span>
                    <button
                      onClick={() => toggleFavorite(currentSong)}
                      className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <Heart
                        size={14}
                        fill={isLiked ? "var(--danger)" : "none"}
                        style={{ color: isLiked ? "var(--danger)" : "var(--text-muted)" }}
                      />
                    </button>
                  </div>
                  <div className="text-sm truncate" style={{ color: "var(--copper)" }}>
                    {currentSong.artist}
                  </div>
                </div>

                {/* Visual Equalizer Display */}
                <div className="hidden xl:block w-32">
                  <VisualEqualizer variant="minimal" barCount={16} />
                </div>
              </div>
            </div>

            {/* Center: Playback controls */}
            <div className="flex items-center gap-2">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className="p-2 rounded-full transition-all hover:bg-white/10 cursor-pointer"
                style={{ color: shuffle ? "var(--amber-glow)" : "var(--text-muted)" }}
                title="Shuffle"
              >
                <Shuffle size={18} />
              </button>

              {/* Previous */}
              <button
                onClick={playPrevious}
                className="p-2 rounded-full transition-all hover:scale-110 hover:bg-white/10 cursor-pointer"
                style={{ color: "var(--warm-cream)" }}
              >
                <SkipBack size={22} />
              </button>

              {/* Play/Pause */}
              <motion.button
                onClick={togglePlay}
                className="p-3 rounded-full cursor-pointer"
                style={{
                  background: "var(--burnt-orange)",
                  color: "var(--vinyl-black)",
                  boxShadow: "0 4px 15px rgba(204, 85, 0, 0.5)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
              </motion.button>

              {/* Next */}
              <button
                onClick={playNext}
                className="p-2 rounded-full transition-all hover:scale-110 hover:bg-white/10 cursor-pointer"
                style={{ color: "var(--warm-cream)" }}
              >
                <SkipForward size={22} />
              </button>

              {/* Repeat */}
              <button
                onClick={cycleRepeat}
                className="p-2 rounded-full transition-all hover:bg-white/10 cursor-pointer relative"
                style={{ color: repeat !== "off" ? "var(--amber-glow)" : "var(--text-muted)" }}
                title={`Repeat: ${repeat}`}
              >
                {repeat === "one" ? <Repeat1 size={18} /> : <Repeat size={18} />}
                {repeat !== "off" && (
                  <motion.div
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "var(--amber-glow)" }}
                    layoutId="repeat-indicator"
                  />
                )}
              </button>
            </div>

            {/* Right: Time, VU, Volume, Queue */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              {/* Time display */}
              <div
                className="text-xs font-mono hidden sm:block"
                style={{ color: "var(--text-secondary)" }}
              >
                <span style={{ color: "var(--copper)" }}>{formatTime(currentTime)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Compact VU Meter */}
              <div className="hidden md:block">
                <CompactVUMeter />
              </div>

              {/* Equalizer */}
              <div className="hidden lg:block">
                <RetroEqualizer compact />
              </div>

              {/* Volume */}
              <div className="hidden sm:block">
                <VolumeSlider />
              </div>

              {/* Queue toggle */}
              <button
                onClick={() => setIsQueueOpen(!isQueueOpen)}
                className="p-2 rounded-full transition-all hover:bg-white/10 cursor-pointer"
                style={{ color: isQueueOpen ? "var(--amber-glow)" : "var(--warm-cream)" }}
                title="Queue"
              >
                <ListMusic size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Queue Panel */}
      <NowPlayingQueue isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
    </>
  );
};

export default MusicPlayer;
