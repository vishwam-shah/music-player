// components/MusicPlayer.jsx
import { useEffect, useState } from 'react';
import { Howl } from 'howler';

export default function MusicPlayer({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    if (!song) return;
    if (sound) sound.unload();

    const newSound = new Howl({ src: [song.audio], html5: true });
    setSound(newSound);

    if (isPlaying) newSound.play();

    return () => newSound.unload();
  }, [song]);

  const togglePlay = () => {
    if (!sound) return;
    if (isPlaying) sound.pause();
    else sound.play();
    setIsPlaying(!isPlaying);
  };

  if (!song) return <p className="text-white">No song selected</p>;

  return (
    <div className="p-6 rounded-xl bg-indigo-800 text-white shadow-md">
      <img src={song.cover} className="w-64 h-64 object-cover rounded-lg mb-4" />
      <h2 className="text-xl font-bold">{song.title}</h2>
      <p>{song.artist}</p>
      <button onClick={togglePlay} className="mt-4 px-4 py-2 bg-white text-indigo-700 rounded-full">
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
