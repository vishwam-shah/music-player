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
      <div ref={containerRef} className="space-y-4 p-6 glass-modal rounded-2xl max-h-96 overflow-y-auto scroll-container">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Synchronized Lyrics</span>
        </div>
        {lyrics.map((line, index) => (
          <p
            key={index}
            ref={index === activeLyricIndex ? activeLineRef : null}
            className={`transition-all duration-300 leading-relaxed ${
              index === activeLyricIndex
                ? 'text-contrast text-xl font-bold scale-105 pl-4 border-l-4 border-violet-500'
                : index === activeLyricIndex - 1 || index === activeLyricIndex + 1
                ? 'text-gray-200 text-lg pl-2'
                : 'text-muted-contrast text-base'
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-x-0 bottom-32 h-96 px-8">
      <div className="h-full glass-modal rounded-3xl overflow-hidden">
        <div className="h-full relative">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-white uppercase tracking-wider">Synchronized Lyrics</span>
              </div>
              <div className="text-sm text-muted-contrast">
                {activeLyricIndex + 1} / {lyrics.length}
              </div>
            </div>
          </div>

          {/* Lyrics content */}
          <div
            ref={containerRef}
            className="h-full overflow-y-auto px-8 py-24 space-y-8 scroll-container"
          >
            {lyrics.map((line, index) => (
              <p
                key={index}
                ref={index === activeLyricIndex ? activeLineRef : null}
                className={`text-center transition-all duration-500 leading-relaxed ${
                  index === activeLyricIndex
                    ? 'text-contrast text-4xl font-bold scale-110 gradient-text drop-shadow-lg'
                    : index === activeLyricIndex - 1 || index === activeLyricIndex + 1
                    ? 'text-gray-100 text-3xl font-semibold'
                    : 'text-muted-contrast text-2xl'
                }`}
              >
                {line.text}
              </p>
            ))}
            <div className="h-48"></div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
