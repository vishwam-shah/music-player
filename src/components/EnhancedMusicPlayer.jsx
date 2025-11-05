"use client";
import React, { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import {
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Heart,
  Download, Shuffle, Repeat, Repeat1, ListMusic, Maximize2,
  MoreHorizontal, Share2
} from 'lucide-react';
import LyricsPanel from './LyricsPanel';
import QueuePanel from './QueuePanel';
import MusicVisualizer from './MusicVisualizer';

export default function EnhancedMusicPlayer() {
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    duration,
    currentTime,
    shuffle,
    repeat,
    togglePlay,
    handleNext,
    handlePrevious,
    changeVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    isFavorite
  } = useAudio();

  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      changeVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      changeVolume(0);
      setIsMuted(true);
    }
  };

  const handleDownload = () => {
    if (!currentSong) return;

    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = currentSong.audio;
    link.download = `${currentSong.title} - ${currentSong.artist}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!currentSong) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentSong.title,
          text: `Check out ${currentSong.title} by ${currentSong.artist}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${currentSong.title} - ${currentSong.artist}`);
      alert('Song info copied to clipboard!');
    }
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-24 glass-strong border-t border-white/10 flex items-center justify-center z-50">
        <p className="text-gray-400">Select a song to start playing</p>
      </div>
    );
  }

  return (
    <>
      {/* Expanded Player View */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[60] flex flex-col animate-slide-up">
          {/* Close Button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full">
            {/* Album Art */}
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 blur-3xl opacity-30 animate-pulse-glow"></div>
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className={`relative w-80 h-80 rounded-3xl shadow-2xl object-cover ${
                  isPlaying ? 'animate-float' : ''
                }`}
              />
              {showVisualizer && (
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <MusicVisualizer />
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 gradient-text">{currentSong.title}</h1>
              <p className="text-xl text-gray-400">{currentSong.artist}</p>
              {currentSong.album && (
                <p className="text-sm text-gray-500 mt-2">{currentSong.album}</p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-6">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center gap-6 mb-8">
              <button
                onClick={toggleShuffle}
                className={`p-3 rounded-full transition-all ${
                  shuffle ? 'text-violet-500' : 'text-white/60 hover:text-white'
                }`}
              >
                <Shuffle size={20} />
              </button>

              <button
                onClick={handlePrevious}
                className="p-3 text-white hover:text-violet-400 transition-colors"
              >
                <SkipBack size={28} fill="currentColor" />
              </button>

              <button
                onClick={togglePlay}
                className="p-6 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all glow-strong"
              >
                {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
              </button>

              <button
                onClick={handleNext}
                className="p-3 text-white hover:text-violet-400 transition-colors"
              >
                <SkipForward size={28} fill="currentColor" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-3 rounded-full transition-all ${
                  repeat !== 'off' ? 'text-violet-500' : 'text-white/60 hover:text-white'
                }`}
              >
                {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
              </button>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleFavorite(currentSong)}
                className={`p-3 rounded-full transition-all ${
                  isFavorite(currentSong.id) ? 'text-pink-500' : 'text-white/60 hover:text-white'
                }`}
              >
                <Heart size={20} fill={isFavorite(currentSong.id) ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={() => setShowLyrics(!showLyrics)}
                className={`p-3 rounded-full transition-all ${
                  showLyrics ? 'text-violet-500' : 'text-white/60 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </button>

              <button
                onClick={() => setShowQueue(!showQueue)}
                className={`p-3 rounded-full transition-all ${
                  showQueue ? 'text-violet-500' : 'text-white/60 hover:text-white'
                }`}
              >
                <ListMusic size={20} />
              </button>

              <button
                onClick={handleDownload}
                className="p-3 text-white/60 hover:text-white rounded-full transition-all"
              >
                <Download size={20} />
              </button>

              <button
                onClick={handleShare}
                className="p-3 text-white/60 hover:text-white rounded-full transition-all"
              >
                <Share2 size={20} />
              </button>

              <button
                onClick={() => setShowVisualizer(!showVisualizer)}
                className={`p-3 rounded-full transition-all ${
                  showVisualizer ? 'text-violet-500' : 'text-white/60 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9h4v12H3V9zm6-6h4v18H9V3zm6 9h4v9h-4v-9z" />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                <button onClick={handleVolumeToggle} className="p-3 text-white/60 hover:text-white transition-colors">
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    changeVolume(newVol);
                    setIsMuted(newVol === 0);
                  }}
                  className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Lyrics Panel */}
          {showLyrics && <LyricsPanel song={currentSong} currentTime={currentTime} />}

          {/* Queue Panel */}
          {showQueue && <QueuePanel />}
        </div>
      )}

      {/* Minimized Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-24 glass-strong border-t border-white/10 z-50">
        <div className="h-full flex items-center justify-between px-4 md:px-6 max-w-[2000px] mx-auto">
          {/* Left: Song Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative group">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-16 h-16 rounded-lg shadow-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setIsExpanded(true)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Maximize2 size={20} className="text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-white truncate">{currentSong.title}</h4>
              <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
            </div>
            <button
              onClick={() => toggleFavorite(currentSong)}
              className="hidden md:block"
            >
              <Heart
                size={20}
                className={isFavorite(currentSong.id) ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}
              />
            </button>
          </div>

          {/* Center: Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleShuffle}
                className={`hidden md:block ${shuffle ? 'text-violet-500' : 'text-gray-400 hover:text-white'} transition-colors`}
              >
                <Shuffle size={18} />
              </button>

              <button
                onClick={handlePrevious}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>

              <button
                onClick={togglePlay}
                className="p-3 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`hidden md:block ${repeat !== 'off' ? 'text-violet-500' : 'text-gray-400 hover:text-white'} transition-colors`}
              >
                {repeat === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-gray-400 min-w-[40px]">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <span className="text-xs text-gray-400 min-w-[40px] text-right">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Volume & More */}
          <div className="hidden lg:flex items-center gap-3 flex-1 justify-end">
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className={showLyrics ? 'text-violet-500' : 'text-gray-400 hover:text-white'}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </button>

            <button
              onClick={() => setShowQueue(!showQueue)}
              className={showQueue ? 'text-violet-500' : 'text-gray-400 hover:text-white'}
            >
              <ListMusic size={20} />
            </button>

            <button onClick={handleDownload} className="text-gray-400 hover:text-white">
              <Download size={20} />
            </button>

            <div className="flex items-center gap-2">
              <button onClick={handleVolumeToggle} className="text-gray-400 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const newVol = parseFloat(e.target.value);
                  changeVolume(newVol);
                  setIsMuted(newVol === 0);
                }}
                className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>

            <button
              onClick={() => setIsExpanded(true)}
              className="text-gray-400 hover:text-white"
            >
              <Maximize2 size={20} />
            </button>
          </div>

          {/* Mobile: Expand Button */}
          <button
            onClick={() => setIsExpanded(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <MoreHorizontal size={24} />
          </button>
        </div>

        {/* Lyrics Overlay */}
        {showLyrics && !isExpanded && (
          <div className="absolute bottom-24 right-4 w-96 max-h-96 glass-strong rounded-2xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Lyrics</h3>
              <button
                onClick={() => setShowLyrics(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <LyricsPanel song={currentSong} currentTime={currentTime} compact />
          </div>
        )}

        {/* Queue Overlay */}
        {showQueue && !isExpanded && (
          <div className="absolute bottom-24 right-4 w-96 max-h-96 glass-strong rounded-2xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Queue</h3>
              <button
                onClick={() => setShowQueue(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <QueuePanel compact />
          </div>
        )}
      </div>
    </>
  );
}
