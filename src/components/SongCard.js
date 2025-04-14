// src/components/SongCard.js

import React from 'react';

const SongCard = ({ song }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold">{song.title}</h3>
      <p className="text-gray-500">{song.artist}</p>
    </div>
  );
};

export default SongCard;
