"use client";
import React from 'react';
import { useAudio } from '../context/AudioContext';
import { X, GripVertical, Play } from 'lucide-react';

export default function QueuePanel({ compact = false }) {
  const { queue, currentIndex, removeFromQueue, clearQueue, loadSong } = useAudio();

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400">
        <p>No songs in queue</p>
        <p className="text-sm mt-2">Add songs to start playing</p>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'max-h-80' : 'h-full'} overflow-y-auto`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Up Next</h3>
          <p className="text-sm text-gray-400">{queue.length} songs</p>
        </div>
        <button
          onClick={clearQueue}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2">
        {queue.map((song, index) => (
          <div
            key={`${song.id}-${index}`}
            className={`group flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all ${
              index === currentIndex ? 'bg-white/10' : ''
            }`}
          >
            {/* Drag Handle */}
            <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity">
              <GripVertical size={16} />
            </button>

            {/* Album Cover */}
            <div className="relative">
              <img
                src={song.cover}
                alt={song.title}
                className="w-12 h-12 rounded-md object-cover"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                  <Play size={16} className="text-white" fill="white" />
                </div>
              )}
            </div>

            {/* Song Info */}
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => loadSong(song, true)}
            >
              <p className={`font-medium truncate ${
                index === currentIndex ? 'text-violet-400' : 'text-white'
              }`}>
                {song.title}
              </p>
              <p className="text-sm text-gray-400 truncate">{song.artist}</p>
            </div>

            {/* Duration */}
            <span className="text-sm text-gray-400">{song.duration || '3:45'}</span>

            {/* Remove Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromQueue(index);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
