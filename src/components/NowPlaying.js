// src/components/NowPlaying.js
import React, { useContext } from 'react';
import { MusicContext } from '../context/MusicContext';
import AlbumArt from './AlbumArt';
import ProgressBar from './ProgressBar';

const NowPlaying = () => {
  const { isPlaying, currentTrack, currentTime, duration } = useContext(MusicContext);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center p-4">
      <AlbumArt isPlaying={isPlaying} coverImage={currentTrack?.cover} />

      <div className="mt-4 text-center">
        <h3 className="text-lg font-bold">{currentTrack?.title || 'Unknown Title'}</h3>
        <p className="text-sm text-gray-500">{currentTrack?.artist || 'Unknown Artist'}</p>
      </div>

      <ProgressBar progress={progress} />
    </div>
  );
};

export default NowPlaying;
