"use client";
import React, { useEffect, useRef } from 'react';

interface LyricLine {
  time: number;
  text: string;
}

interface SongWithLyrics {
  lyrics?: LyricLine[];
}

interface LyricsPanelProps {
  song: SongWithLyrics | null;
  currentTime: number;
  compact?: boolean;
}

const LyricsPanel: React.FC<LyricsPanelProps> = ({ song, currentTime, compact = false }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);

  const getLyrics = () => {
    if (!song || !song.lyrics) {
      return [
        { time: 0, text: "♪ Instrumental ♪" },
        { time: 10, text: "Lyrics not available for this song" },
        { time: 20, text: "Enjoy the music!" }
      ];
    }
    return song.lyrics;
  };

  const lyrics = getLyrics();

  const getActiveLyricIndex = () => {
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        return i;
      }
    }
    return 0;
  };

  const activeLyricIndex = getActiveLyricIndex();

  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeLyricIndex]);

  if (compact) {
    return (
      <div ref={containerRef} className="space-y-3">
        {lyrics.map((line, index) => (
          <p
            key={index}
            ref={index === activeLyricIndex ? activeLineRef : null}
            className={`transition-all duration-300 ${
              index === activeLyricIndex
                ? 'text-white text-lg font-semibold scale-105'
                : index === activeLyricIndex - 1 || index === activeLyricIndex + 1
                ? 'text-gray-300 text-base'
                : 'text-gray-500 text-sm'
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-x-0 bottom-32 h-80 overflow-hidden">
      <div className="h-full overflow-y-auto px-8 py-20 space-y-6 scrollbar-hide">
        {lyrics.map((line, index) => (
          <p
            key={index}
            ref={index === activeLyricIndex ? activeLineRef : null}
            className={`transition-all duration-300 ${
              index === activeLyricIndex
                ? 'text-white text-2xl font-bold scale-110'
                : index === activeLyricIndex - 1 || index === activeLyricIndex + 1
                ? 'text-gray-300 text-lg'
                : 'text-gray-500 text-base'
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LyricsPanel;
