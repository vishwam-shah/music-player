// src/App.js

import React from 'react';
import { MusicProvider } from '../context/MusicContext';  // Import the MusicProvider
import SearchBar from '../components/SearchBar';
import SongList from '../components/SongList'; // Import the SongList component

function App() {
  return (
    <MusicProvider> {/* Wrap your app with the MusicProvider */}
      <div className="container mx-auto p-4">
        <SearchBar />
        <SongList />
      </div>
    </MusicProvider>
  );
}

export default App;
