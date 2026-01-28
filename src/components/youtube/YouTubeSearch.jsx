'use client';

import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Youtube,
  Search,
  Download,
  Play,
  Loader2,
  AlertCircle,
  X,
  Link2
} from 'lucide-react';
import { PlayerContext } from '../../context/PlayerContext';

export default function YouTubeSearch({ onClose }) {
  const { playSong, addToQueue } = useContext(PlayerContext);

  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const isValidYouTubeUrl = (url) => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      /^(https?:\/\/)?(music\.)?youtube\.com\/.+$/
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) return;

    if (!isValidYouTubeUrl(url)) {
      setError('Please enter a valid YouTube or YouTube Music URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process video');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    if (result) {
      playSong({
        id: `yt-${Date.now()}`,
        title: result.title,
        artist: result.artist || result.channel,
        cover: result.thumbnail,
        audio: result.audioUrl,
        duration: result.duration,
        isYouTube: true
      });
      onClose?.();
    }
  };

  const handleAddToQueue = () => {
    if (result) {
      addToQueue({
        id: `yt-${Date.now()}`,
        title: result.title,
        artist: result.artist || result.channel,
        cover: result.thumbnail,
        audio: result.audioUrl,
        duration: result.duration,
        isYouTube: true
      });
      setUrl('');
      setResult(null);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg rounded-xl overflow-hidden"
        style={{
          background: 'var(--surface)',
          border: '3px solid var(--walnut)'
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--vinyl-groove)' }}
        >
          <div className="flex items-center gap-2">
            <Youtube size={24} style={{ color: '#FF0000' }} />
            <h2
              className="font-bold text-lg"
              style={{ color: 'var(--warm-cream)' }}
            >
              Play from YouTube
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* URL input */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="relative">
              <Link2
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube URL here..."
                className="w-full pl-10 pr-4 py-3 rounded-lg outline-none"
                style={{
                  background: 'var(--vinyl-groove)',
                  color: 'var(--warm-cream)',
                  border: '2px solid var(--walnut)'
                }}
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="retro-button retro-button-primary w-full mt-3 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Get Audio</span>
                </>
              )}
            </button>
          </form>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 rounded-lg mb-4"
                style={{
                  background: 'var(--danger)',
                  color: 'var(--warm-cream)'
                }}
              >
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="rounded-lg overflow-hidden"
                style={{
                  background: 'var(--vinyl-groove)',
                  border: '2px solid var(--walnut)'
                }}
              >
                {/* Thumbnail */}
                {result.thumbnail && (
                  <div className="relative aspect-video">
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.4)' }}
                    >
                      <button
                        onClick={handlePlay}
                        className="p-4 rounded-full transition-transform hover:scale-110"
                        style={{
                          background: 'var(--burnt-orange)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                        }}
                      >
                        <Play size={32} fill="var(--warm-cream)" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <h3
                    className="font-semibold mb-1 line-clamp-2"
                    style={{ color: 'var(--warm-cream)' }}
                  >
                    {result.title}
                  </h3>
                  <p
                    className="text-sm mb-3"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {result.artist || result.channel}
                    {result.duration && (
                      <span className="ml-2">
                        {Math.floor(result.duration / 60)}:
                        {(result.duration % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handlePlay}
                      className="retro-button retro-button-primary flex-1 flex items-center justify-center gap-2"
                    >
                      <Play size={16} />
                      <span>Play Now</span>
                    </button>
                    <button
                      onClick={handleAddToQueue}
                      className="retro-button flex items-center justify-center gap-2"
                    >
                      <span>Add to Queue</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          {!result && !error && !isLoading && (
            <div
              className="text-center text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              <p className="mb-2">Supported sources:</p>
              <ul className="space-y-1">
                <li>youtube.com/watch?v=...</li>
                <li>youtu.be/...</li>
                <li>music.youtube.com/watch?v=...</li>
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
