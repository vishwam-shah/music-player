// src/context/MusicContext.js

import React, { createContext, useState } from 'react';

// Create the MusicContext
export const MusicContext = createContext();

// MusicProvider component to wrap around the app
export const MusicProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <MusicContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </MusicContext.Provider>
  );
};
