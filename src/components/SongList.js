
"use client";


import React, { useContext } from 'react';
import { MusicContext } from '../context/MusicContext';
import SongCard from './SongCard'; // Assuming you have a SongCard component for each song

const SongList = () => {
  const { searchQuery } = useContext(MusicContext);
  
  // Dummy song data
  const songs = [
    { id: 1, title: 'Song A', artist: 'Artist 1' },
    { id: 2, title: 'Song B', artist: 'Artist 2' },
    { id: 3, title: 'Song C', artist: 'Artist 3' },
    // Add more songs here
  ];

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
      {filteredSongs.map(song => (
        <SongCard key={song.id} song={song} />
      ))}
    </div>
  );
};

export default SongList;
