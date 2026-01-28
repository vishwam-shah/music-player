"use client";

import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Music, GripVertical } from "lucide-react";
import Image from "next/image";
import { PlayerContext } from "../../context/PlayerContext";
import type { PlayerContextType, Song } from "../../types";

interface NowPlayingQueueProps {
  isOpen: boolean;
  onClose: () => void;
}

const NowPlayingQueue: React.FC<NowPlayingQueueProps> = ({ isOpen, onClose }) => {
  const {
    queue,
    queueIndex,
    currentSong,
    playSong,
    removeFromQueue,
    clearQueue
  } = useContext(PlayerContext) as PlayerContextType;

  const upcomingTracks = queue.slice(queueIndex + 1);
  const previousTracks = queue.slice(0, queueIndex);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-30"
            style={{ background: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Queue panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-20 z-40 w-80 overflow-hidden flex flex-col"
            style={{
              background: "var(--surface)",
              borderLeft: "2px solid var(--walnut)"
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: "var(--vinyl-groove)" }}
            >
              <h2
                className="font-bold text-lg"
                style={{ color: "var(--warm-cream)" }}
              >
                Queue
              </h2>
              <div className="flex items-center gap-2">
                {queue.length > 1 && (
                  <button
                    onClick={clearQueue}
                    className="text-sm px-2 py-1 rounded hover:bg-white/10 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            {/* Content - using custom scrollbar */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
              {queue.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full text-center p-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  <div
                    className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                    style={{ background: "var(--vinyl-groove)" }}
                  >
                    <Music size={24} />
                  </div>
                  <p>Your queue is empty</p>
                  <p className="text-sm mt-1">Play some tracks to fill it up</p>
                </div>
              ) : (
                <div className="p-2">
                  {/* Now Playing */}
                  {currentSong && (
                    <div className="mb-4">
                      <div
                        className="text-xs uppercase tracking-wider mb-2 px-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Now Playing
                      </div>
                      <QueueItem
                        song={currentSong}
                        isCurrentSong
                        isPlaying
                      />
                    </div>
                  )}
                  {/* Up Next */}
                  {upcomingTracks.length > 0 && (
                    <div className="mb-4">
                      <div
                        className="text-xs uppercase tracking-wider mb-2 px-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Up Next ({upcomingTracks.length})
                      </div>
                      {upcomingTracks.map((song, index) => (
                        <QueueItem
                          key={`upcoming-${index}`}
                          song={song}
                          index={queueIndex + 1 + index}
                          onPlay={() => playSong(song, queue, queueIndex + 1 + index)}
                          onRemove={() => removeFromQueue(queueIndex + 1 + index)}
                        />
                      ))}
                    </div>
                  )}
                  {/* Previously Played */}
                  {previousTracks.length > 0 && (
                    <div>
                      <div
                        className="text-xs uppercase tracking-wider mb-2 px-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Previously Played
                      </div>
                      {previousTracks.map((song, index) => (
                        <QueueItem
                          key={`prev-${index}`}
                          song={song}
                          index={index}
                          onPlay={() => playSong(song, queue, index)}
                          dimmed
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface QueueItemProps {
  song: Song;
  index?: number;
  isCurrentSong?: boolean;
  isPlaying?: boolean;
  onPlay?: () => void;
  onRemove?: () => void;
  dimmed?: boolean;
}

const QueueItem: React.FC<QueueItemProps> = ({ song, isCurrentSong, isPlaying, onPlay, onRemove, dimmed }) => {
  return (
    <motion.div
      className="group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors"
      style={{
        background: isCurrentSong ? "var(--vinyl-groove)" : "transparent",
        opacity: dimmed ? 0.5 : 1
      }}
      whileHover={{ background: "var(--surface-elevated)" }}
      onClick={onPlay}
      layout
    >
      {/* Drag handle */}
      <div
        className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "var(--text-muted)" }}
      >
        <GripVertical size={14} />
      </div>
      {/* Cover */}
      <div
        className="w-10 h-10 rounded shrink-0 overflow-hidden relative"
        style={{ border: "1px solid var(--vinyl-groove)" }}
      >
        {song.cover ? (
          <Image
            src={song.cover}
            alt={song.title}
            className="w-full h-full object-cover"
            fill
            sizes="40px"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "var(--vinyl-black)" }}
          >
            <Music size={16} style={{ color: "var(--text-muted)" }} />
          </div>
        )}
        {/* Now playing indicator */}
        {isCurrentSong && isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="flex gap-0.5">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{ background: "var(--amber-glow)" }}
                  animate={{ height: [4, 12, 4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.4,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          className="font-medium truncate text-sm"
          style={{ color: isCurrentSong ? "var(--copper)" : "var(--warm-cream)" }}
        >
          {song.title}
        </div>
        <div
          className="text-xs truncate"
          style={{ color: "var(--text-secondary)" }}
        >
          {song.artist}
        </div>
      </div>
      {/* Remove button */}
      {onRemove && !isCurrentSong && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
        >
          <Trash2 size={14} style={{ color: "var(--danger)" }} />
        </button>
      )}
    </motion.div>
  );
};

export default NowPlayingQueue;
