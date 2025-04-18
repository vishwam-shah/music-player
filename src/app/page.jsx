"use client";
import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import MusicPlayer from "../components/MusicPlayer";
import TrackList from "../components/TrackList";
import songsData from '../data/songs.json';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setSongs(songsData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Animate background change when a song is selected
    anime({
      targets: 'body',
      background: selectedSong
        ? 'linear-gradient(to bottom right, #FF5F6D, #FFC371)'
        : 'linear-gradient(to bottom right, #6a11cb, #2575fc)',
      easing: 'easeInOutQuad',
      duration: 1000,
    });

    // Animate song title and artist
    if (selectedSong) {
      anime({
        targets: '.song-title',
        opacity: [0, 1],
        translateY: [20, 0],
        easing: 'easeOutQuad',
        duration: 800,
      });

      anime({
        targets: '.artist-name',
        opacity: [0, 1],
        translateY: [20, 0],
        easing: 'easeOutQuad',
        duration: 800,
        delay: 200,
      });
    }
  }, [selectedSong]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-6 scroll-container"
    >
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title or artist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 w-full rounded-md border-2 border-indigo-600 bg-transparent text-white placeholder-gray-400"
        />
      </div>

      {/* Main Content */}
      {loading ? (
        <p className="text-white">Loading songs...</p>
      ) : filteredSongs.length === 0 ? (
        <p className="text-white">No songs found...</p>
      ) : !selectedSong ? (
        <TrackList songs={filteredSongs} onSelect={setSelectedSong} />
      ) : (
        <div className="flex flex-col items-center">
          <MusicPlayer song={selectedSong} />
          <button
            onClick={() => setSelectedSong(null)}
            className="mt-4 text-indigo-200 underline"
          >
            Back to Track List
          </button>
        </div>
      )}
    </div>
  );
}
