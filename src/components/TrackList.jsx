import React from 'react';

export default function TrackList({ songs, onSelect }) {
  const handleClick = (song) => {
    onSelect(song);  // This will set the selected song
  };

  return (
    <div className="track-list grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {songs.map((song, index) => (
        <div
          key={index}
          className="track-card p-4 m-2 bg-indigo-800 rounded-lg cursor-pointer transition-transform transform hover:scale-105"
          onClick={() => handleClick(song)}  // Make sure this triggers onSelect
        >
          <img src={song.coverImage} alt={song.title} className="w-full h-48 object-cover rounded-lg" />
          <div className="mt-2 text-white">
            <h3 className="text-lg font-semibold">{song.title}</h3>
            <p className="text-sm">{song.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
