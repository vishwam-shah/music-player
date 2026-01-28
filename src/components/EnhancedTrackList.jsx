"use client";
import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, Heart, Plus, MoreVertical, ListPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EnhancedTrackList({ songs, view = 'grid' }) {
  const {
    currentSong,
    isPlaying,
    playQueue,
    loadSong,
    toggleFavorite,
    isFavorite,
    addToQueue,
    playlists,
    addToPlaylist
  } = useAudio();

  const [hoveredSong, setHoveredSong] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  const handlePlaySong = (song, index) => {
    if (currentSong?.id === song.id) {
      // If same song, just toggle play/pause
      const audio = useAudio();
      audio.togglePlay();
    } else {
      // Play new song and set queue
      playQueue(songs, index);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (view === 'list') {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        {songs.map((song, index) => {
          const isCurrentSong = currentSong?.id === song.id;
          const isHovered = hoveredSong === song.id;

          return (
            <motion.div
              key={song.id}
              variants={item}
              onMouseEnter={() => setHoveredSong(song.id)}
              onMouseLeave={() => setHoveredSong(null)}
              className={`group flex items-center gap-4 p-3 rounded-lg glass hover:glass-strong transition-all cursor-pointer ${
                isCurrentSong ? 'bg-violet-500/20' : ''
              }`}
            >
              {/* Index/Play Button */}
              <div className="w-8 flex items-center justify-center">
                {isHovered || isCurrentSong ? (
                  <button
                    onClick={() => handlePlaySong(song, index)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-500 hover:bg-violet-600 transition-colors"
                  >
                    {isCurrentSong && isPlaying ? (
                      <Pause size={14} fill="white" />
                    ) : (
                      <Play size={14} fill="white" className="ml-0.5" />
                    )}
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">{index + 1}</span>
                )}
              </div>

              {/* Album Cover */}
              <img
                src={song.cover}
                alt={song.title}
                className="w-14 h-14 rounded-md object-cover shadow-lg"
              />

              {/* Song Info */}
              <div className="flex-1 min-w-0" onClick={() => handlePlaySong(song, index)}>
                <p className={`font-semibold truncate ${
                  isCurrentSong ? 'text-violet-400' : 'text-white'
                }`}>
                  {song.title}
                </p>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
              </div>

              {/* Album */}
              {song.album && (
                <div className="hidden lg:block flex-1 min-w-0">
                  <p className="text-sm text-gray-400 truncate">{song.album}</p>
                </div>
              )}

              {/* Duration */}
              <span className="text-sm text-gray-400">{song.duration || '3:45'}</span>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(song);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Heart
                    size={18}
                    className={isFavorite(song.id) ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}
                  />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToQueue(song);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ListPlus size={18} className="text-gray-400" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(showMenu === song.id ? null : song.id);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
                >
                  <MoreVertical size={18} className="text-gray-400" />

                  {/* Dropdown Menu */}
                  {showMenu === song.id && (
                    <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-lg shadow-xl z-10 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToQueue(song);
                          setShowMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                      >
                        Add to queue
                      </button>
                      {playlists.length > 0 && (
                        <>
                          <div className="border-t border-white/10 my-2"></div>
                          <div className="px-4 py-1 text-xs text-gray-400">Add to playlist</div>
                          {playlists.map((playlist) => (
                            <button
                              key={playlist.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToPlaylist(playlist.id, song);
                                setShowMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                            >
                              {playlist.name}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
    >
      {songs.map((song, index) => {
        const isCurrentSong = currentSong?.id === song.id;

        return (
          <motion.div
            key={song.id}
            variants={item}
            className="group glass rounded-xl p-4 hover:glass-strong hover-lift transition-all cursor-pointer relative"
            onClick={() => handlePlaySong(song, index)}
          >
            {/* Album Cover */}
            <div className="relative mb-4 aspect-square">
              <img
                src={song.cover}
                alt={song.title}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />

              {/* Play Button Overlay */}
              <div className={`absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center transition-opacity ${
                isCurrentSong ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlaySong(song, index);
                  }}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-xl transform scale-0 group-hover:scale-100 transition-transform glow"
                >
                  {isCurrentSong && isPlaying ? (
                    <Pause size={24} fill="white" />
                  ) : (
                    <Play size={24} fill="white" className="ml-1" />
                  )}
                </button>
              </div>

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(song);
                }}
                className="absolute top-2 right-2 p-2 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart
                  size={16}
                  className={isFavorite(song.id) ? 'text-pink-500 fill-pink-500' : 'text-white'}
                />
              </button>

              {/* Now Playing Indicator */}
              {isCurrentSong && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-violet-500 rounded-full text-xs font-semibold flex items-center gap-1">
                  {isPlaying && (
                    <div className="flex gap-0.5 items-end h-3">
                      <div className="w-0.5 bg-white rounded-full animate-pulse" style={{ height: '40%' }}></div>
                      <div className="w-0.5 bg-white rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }}></div>
                      <div className="w-0.5 bg-white rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                  <span>Playing</span>
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="space-y-1">
              <h3 className={`font-semibold truncate ${
                isCurrentSong ? 'text-violet-400' : 'text-white'
              }`}>
                {song.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">{song.artist}</p>
            </div>

            {/* More Options */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(showMenu === song.id ? null : song.id);
              }}
              className="absolute top-2 left-2 p-2 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus size={16} className="text-white" />
            </button>

            {/* Dropdown Menu */}
            {showMenu === song.id && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-12 left-2 w-48 glass-strong rounded-lg shadow-xl z-10 py-2"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToQueue(song);
                    setShowMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <ListPlus size={16} />
                  Add to queue
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(song);
                    setShowMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Heart size={16} />
                  {isFavorite(song.id) ? 'Remove from' : 'Add to'} favorites
                </button>
                {playlists.length > 0 && (
                  <>
                    <div className="border-t border-white/10 my-2"></div>
                    <div className="px-4 py-1 text-xs text-gray-400">Add to playlist</div>
                    {playlists.map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToPlaylist(playlist.id, song);
                          setShowMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                      >
                        {playlist.name}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
