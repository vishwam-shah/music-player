"use client";

import React, { useContext } from 'react';
import { MusicContext } from '../context/MusicContext';

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useContext(MusicContext);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="w-full p-4 bg-black text-black">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for a song..."
        className="w-full p-3 rounded-lg border bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
