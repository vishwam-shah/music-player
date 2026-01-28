"use client";
import React, { useEffect, useRef } from 'react';

export default function LyricsPanel({ song, currentTime, compact = false }) {
  const containerRef = useRef(null);
  const activeLineRef = useRef(null);

  // Sample lyrics data structure
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

  // Find active lyric line
  const getActiveLyricIndex = () => {
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        return i;
      }
    }
    return 0;
  };

  const activeLyricIndex = getActiveLyricIndex();

  // Auto-scroll to active lyric
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
    <div className="absolute inset-x-0 bottom-32 h-80 overflow-hidden">
      <div
        ref={containerRef}
        className="h-full overflow-y-auto px-8 py-20 space-y-6 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {lyrics.map((line, index) => (
          <p
            key={index}
            ref={index === activeLyricIndex ? activeLineRef : null}
            className={`text-center transition-all duration-500 ${
              index === activeLyricIndex
                ? 'text-white text-3xl font-bold scale-110 gradient-text'
                : index === activeLyricIndex - 1 || index === activeLyricIndex + 1
                ? 'text-gray-300 text-2xl'
                : 'text-gray-600 text-xl'
            }`}
          >
            {line.text}
          </p>
        ))}
        <div className="h-40"></div>
      </div>
    </div>
  );
}
