// Converted from CassetteCard.jsx to CassetteCard.tsx
'use client';

import React from 'react';
import type { Playlist } from '../../types';

interface CassetteCardProps {
  playlist: Playlist;
  onClick?: () => void;
  onPlay?: () => void;
}

export default function CassetteCard({ playlist, onClick, onPlay }: CassetteCardProps) {
  return (
    <div
      className="cassette-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="cassette-details">
        <h3 className="cassette-title">{playlist.name}</h3>
        <p className="cassette-count">{playlist.songs.length} songs</p>
      </div>
      <button
        className="cassette-play"
        onClick={(e) => {
          e.stopPropagation();
          onPlay?.();
        }}
      >
        Play
      </button>
    </div>
  );
}
