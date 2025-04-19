"use client";
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TrackList from '../components/TrackList';
import MusicPlayer from '../components/MusicPlayer';

const dummySongs = [
  {
    "id": 1,
    "title": "Chill Vibes",
    "artist": "Dreamscape",
    "cover": "/assets/cover1.jpeg",
    "audio": "/assets/song1.mp3"
  },
  {
    "id": 2,
    "title": "Sunset Drive",
    "artist": "Neon Palms",
    "cover": "/assets/cover2.jpeg",
    "audio": "/assets/song2.mp3"
  },
  {
    "id": 3,
    "title": "Ocean Breeze",
    "artist": "Waveform",
    "cover": "/assets/cover3.jpeg",
    "audio": "/assets/song3.mp3"
  },
  {
    "id": 4,
    "title": "Night Sky",
    "artist": "Lunaria",
    "cover": "/assets/cover4.jpeg",
    "audio": "/assets/song4.mp3"
  },
  {
    "id": 5,
    "title": "City Lights",
    "artist": "Midnight Avenue",
    "cover": "/assets/cover5.jpeg",
    "audio": "/assets/song5.mp3"
  },
  {
    "id": 6,
    "title": "Lo-Fi Dreams",
    "artist": "Sleeploop",
    "cover": "/assets/cover6.jpeg",
    "audio": "/assets/song6.mp3"
  },
  {
    "id": 7,
    "title": "Golden Hour",
    "artist": "Aura Bloom",
    "cover": "/assets/cover7.jpeg",
    "audio": "/assets/song7.mp3"
  },
  {
    "id": 8,
    "title": "Waves & Wind",
    "artist": "Coastal Beats",
    "cover": "/assets/cover8.jpeg",
    "audio": "/assets/song8.mp3"
  },
  {
    "id": 9,
    "title": "Jazz & Rain",
    "artist": "Late Lounge",
    "cover": "/assets/cover9.jpeg",
    "audio": "/assets/song9.mp3"
  },
  {
    "id": 10,
    "title": "Electric Summer",
    "artist": "Synthline",
    "cover": "/assets/cover10.jpeg",
    "audio": "/assets/song10.mp3"
  },
  
]


function App() {
  const [selectedSong, setSelectedSong] = React.useState(dummySongs[0]);

  return (
    <div className="flex bg-zinc-900 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <h2 className="text-2xl font-bold mb-4">Browse All</h2>
          <TrackList songs={dummySongs} onSelect={setSelectedSong} />
        </main>
        <MusicPlayer song={selectedSong} />
      </div>
    </div>
  );
}

export default App;
