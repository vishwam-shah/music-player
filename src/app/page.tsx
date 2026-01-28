"use client";

import React, { useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MusicPlayer from '../components/player/MusicPlayer';
import Library from '../components/library/Library';
import YouTubeSearch from '../components/youtube/YouTubeSearch';
import JioSaavnSearch from '../components/jiosaavn/JioSaavnSearch';
import fileSystemService from '../services/fileSystemService';
import type { Song } from '../types';

// Demo songs - replace with your actual music files
const dummySongs: Song[] = [
  { id: 1, title: 'Chill Vibes', artist: 'Dreamscape', cover: '/assets/cover1.jpeg', audio: '/assets/song1.mp3' },
  { id: 2, title: 'Sunset Drive', artist: 'Neon Palms', cover: '/assets/cover2.jpeg', audio: '/assets/song2.mp3' },
  { id: 3, title: 'Ocean Breeze', artist: 'Waveform', cover: '/assets/cover3.jpeg', audio: '/assets/song3.mp3' },
  { id: 4, title: 'Night Sky', artist: 'Lunaria', cover: '/assets/cover4.jpeg', audio: '/assets/song4.mp3' },
  { id: 5, title: 'City Lights', artist: 'Midnight Avenue', cover: '/assets/cover5.jpeg', audio: '/assets/song5.mp3' },
  { id: 6, title: 'Lo-Fi Dreams', artist: 'Sleeploop', cover: '/assets/cover6.jpeg', audio: '/assets/song6.mp3' },
  { id: 7, title: 'Golden Hour', artist: 'Aura Bloom', cover: '/assets/cover7.jpeg', audio: '/assets/song7.mp3' },
  { id: 8, title: 'Waves & Wind', artist: 'Coastal Beats', cover: '/assets/cover8.jpeg', audio: '/assets/song8.mp3' },
  { id: 9, title: 'Jazz & Rain', artist: 'Late Lounge', cover: '/assets/cover9.jpeg', audio: '/assets/song9.mp3' },
  { id: 10, title: 'Electric Summer', artist: 'Synthline', cover: '/assets/cover10.jpeg', audio: '/assets/song10.mp3' },
];

export default function Page() {
  const [activeView, setActiveView] = useState('home');
  const [isYouTubeOpen, setIsYouTubeOpen] = useState(false);
  const [isJioSaavnOpen, setIsJioSaavnOpen] = useState(false);
  const [localSongs, setLocalSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Combine demo songs with local songs
  const allSongs = [...dummySongs, ...localSongs];

  const handleAddLocalFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const songs = await fileSystemService.scanFolder();
      if (songs.length > 0) {
        setLocalSongs(prev => [...prev, ...songs]);
      }
    } catch (error) {
      console.error('Failed to add local files:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            if (view === 'jiosaavn') {
              setIsJioSaavnOpen(true);
            }
          }}
          onYouTubeOpen={() => setIsYouTubeOpen(true)}
          onAddLocalFiles={handleAddLocalFiles}
        />
        {/* Main content area with custom scrollbar */}
        <div className="flex-1 overflow-y-auto pb-24">
          <Library
            songs={allSongs}
            onAddLocalFiles={handleAddLocalFiles}
          />
          {isLoading && (
            <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="p-6 rounded-xl" style={{ background: 'var(--surface)' }}>
                <div className="animate-spin w-8 h-8 border-4 rounded-full mx-auto mb-4" style={{ borderColor: 'var(--copper)', borderTopColor: 'transparent' }} />
                <p style={{ color: 'var(--warm-cream)' }}>Loading files...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Player controls at bottom */}
      <MusicPlayer />

      {/* YouTube Search Modal */}
      <YouTubeSearch
        isOpen={isYouTubeOpen}
        onClose={() => setIsYouTubeOpen(false)}
      />

      {/* JioSaavn Search Modal */}
      {isJioSaavnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div
            className="w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden"
            style={{
              background: 'var(--color-background)',
              border: '2px solid var(--color-border)',
              boxShadow: '0 20px 60px var(--color-shadow)',
            }}
          >
            <JioSaavnSearch onClose={() => setIsJioSaavnOpen(false)} />
          </div>
        </div>
      )}
    </main>
  );
}
