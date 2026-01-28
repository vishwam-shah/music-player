import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import { PlayerContext } from "../../context/PlayerContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import type { FavoritesContextType } from "../../types";
import type { PlayerContextType } from "../../types";
import type { Song } from "../../types";
import Image from "next/image";

interface AlbumSleeveProps {
  song: Song;
  songs: Song[];
  index: number;
  onContextMenu?: (e: React.MouseEvent, song: Song) => void;
}

const AlbumSleeve: React.FC<AlbumSleeveProps> = ({ song, songs, index, onContextMenu }) => {
  const { playSong, currentSong, isPlaying } = useContext(PlayerContext) as PlayerContextType;
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext) as FavoritesContextType;

  const isCurrentSong = currentSong?.id === song.id;
  const isLiked = isFavorite(song);

  const handlePlay = () => {
    playSong(song, songs, index);
  };

  return (
    <motion.div
      className="group relative album-sleeve cursor-pointer"
      style={{
        background: "var(--color-surface)",
        border: isCurrentSong ? "2px solid var(--color-primary)" : "2px solid var(--color-border)",
        transition: isCurrentSong && isPlaying ? "box-shadow 1.5s ease-in-out infinite alternate" : undefined
      }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handlePlay}
      animate={isCurrentSong && isPlaying ? {
        boxShadow: "0 0 20px rgba(255, 191, 0, 0.4)"
      } : {
        boxShadow: "0 0 0px rgba(255, 191, 0, 0)"
      }}
    >
      {/* Animated border glow for playing song */}
      {isCurrentSong && isPlaying && (
        <motion.div
          className="absolute -inset-0.5 rounded-[inherit] -z-10"
          style={{ background: "linear-gradient(45deg, var(--burnt-orange), var(--amber-glow), var(--copper))" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}
      {/* Album cover container */}
      <div className="relative aspect-square overflow-hidden">
        {/* Cover image */}
        {song.cover ? (
          <motion.div
            className="w-full h-full"
            animate={isCurrentSong && isPlaying ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={song.cover}
              alt={song.title}
              className="w-full h-full object-cover"
              fill
              sizes="100%"
            />
          </motion.div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "var(--mahogany)" }}
          >
            <div
              className="w-3/4 h-3/4 rounded-full"
              style={{ background: "var(--vinyl-black)" }}
            />
          </div>
        )}
        {/* Vinyl peeking out effect - spins when playing */}
        <motion.div
          className="absolute bottom-0 right-0 w-1/3 h-1/3 rounded-full"
          style={{ background: "var(--vinyl-black)" }}
          animate={isCurrentSong && isPlaying ? {
            x: "50%",
            y: "50%",
            rotate: 360
          } : {
            x: "25%",
            y: "25%",
            rotate: 0
          }}
          transition={isCurrentSong && isPlaying ? {
            x: { duration: 0.3 },
            y: { duration: 0.3 },
            rotate: { duration: 2, repeat: Infinity, ease: "linear" }
          } : { duration: 0.3 }}
          whileHover={!isPlaying ? { x: "50%", y: "50%" } : {}}
        >
          <div
            className="absolute inset-2 rounded-full"
            style={{ background: "var(--vinyl-groove)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full"
            style={{ background: song.cover ? "var(--label-red)" : "var(--burnt-orange)" }}
          />
        </motion.div>
        {/* Play overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          animate={isCurrentSong && isPlaying ? { opacity: 0 } : {}}
        >
          <motion.button
            className="p-4 rounded-full"
            style={{ background: "var(--burnt-orange)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={24} fill="var(--warm-cream)" />
          </motion.button>
        </motion.div>
        {/* Now playing indicator - enhanced with glow */}
        {isCurrentSong && isPlaying && (
          <motion.div
            className="absolute bottom-2 left-2 flex gap-0.5 px-2 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ background: "var(--amber-glow)", boxShadow: "0 0 4px var(--amber-glow)" }}
                animate={{ height: [6, 14, 6] }}
                transition={{ repeat: Infinity, duration: 0.4 + i * 0.1, delay: i * 0.08, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        )}
      </div>
      {/* Info section */}
      <div className="p-3">
        <div className="font-semibold truncate mb-1" style={{ color: isCurrentSong ? "var(--color-primary)" : "var(--color-text)" }}>
          {song.title}
        </div>
        <div className="text-sm truncate" style={{ color: "var(--color-textMuted)" }}>
          {song.artist}
        </div>
      </div>
      {/* Quick actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(song);
          }}
          className="p-1.5 rounded-full transition-colors"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <Heart size={14} fill={isLiked ? "var(--danger)" : "none"} style={{ color: isLiked ? "var(--danger)" : "var(--warm-cream)" }} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu?.(e, song);
          }}
          className="p-1.5 rounded-full transition-colors"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <MoreHorizontal size={14} style={{ color: "var(--warm-cream)" }} />
        </button>
      </div>
    </motion.div>
  );
};

interface TrackListItemProps {
  song: Song;
  songs: Song[];
  index: number;
  showNumber?: boolean;
}

export const TrackListItem: React.FC<TrackListItemProps> = ({ song, songs, index, showNumber = false }) => {
  const { playSong, currentSong, isPlaying } = useContext(PlayerContext) as PlayerContextType;
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext) as FavoritesContextType;

  const isCurrentSong = currentSong?.id === song.id;
  const isLiked = isFavorite(song);

  return (
    <motion.div
      className="group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors"
      style={{ background: isCurrentSong ? "var(--color-surfaceHover)" : "transparent" }}
      whileHover={{ background: "var(--color-surfaceHover)" }}
      onClick={() => playSong(song, songs, index)}
    >
      {/* Track number or play icon */}
      <div className="w-8 flex items-center justify-center">
        {showNumber ? (
          <span className="text-sm group-hover:hidden" style={{ color: isCurrentSong ? "var(--color-primary)" : "var(--color-textMuted)" }}>
            {index + 1}
          </span>
        ) : null}
        <Play size={16} className={showNumber ? "hidden group-hover:block" : ""} style={{ color: "var(--color-text)" }} />
        {isCurrentSong && isPlaying && (
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 rounded-full"
                style={{ background: "var(--amber-glow)" }}
                animate={{ height: [4, 10, 4] }}
                transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.08 }}
              />
            ))}
          </div>
        )}
      </div>
      {/* Cover */}
      <div className="w-10 h-10 rounded shrink-0 overflow-hidden" style={{ border: "1px solid var(--vinyl-groove)" }}>
        {song.cover ? (
          <Image src={song.cover} alt={song.title} className="w-full h-full object-cover" width={40} height={40} />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--vinyl-black)" }} />
        )}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate" style={{ color: isCurrentSong ? "var(--color-primary)" : "var(--color-text)" }}>
          {song.title}
        </div>
        <div className="text-sm truncate" style={{ color: "var(--color-textMuted)" }}>
          {song.artist}
        </div>
      </div>
      {/* Actions */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(song);
        }}
        className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Heart size={16} fill={isLiked ? "var(--danger)" : "none"} style={{ color: isLiked ? "var(--danger)" : "var(--text-muted)" }} />
      </button>
      {/* Duration placeholder */}
      <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
        {song.duration || "3:45"}
      </span>
    </motion.div>
  );
};

export default AlbumSleeve;
