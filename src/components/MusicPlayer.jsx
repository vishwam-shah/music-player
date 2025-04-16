import React, { useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';
import anime from 'animejs';
// import anime from 'animejs/lib/anime.es.js';
// import AlbumArt from './AlbumArt';

// <AlbumArt isPlaying={isPlaying} />



export default function MusicPlayer({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const playBtnRef = useRef(null);

  useEffect(() => {
    if (song?.audio) {
      const newSound = new Howl({
        src: [song.audio],
        html5: true,
        onend: () => {
          setIsPlaying(false);
          setProgress(0);
        },
      });

      setSound(newSound);
    }

    return () => {
      sound?.unload();
      clearInterval(intervalRef.current);
    };
  }, [song]);

  const animateProgress = (value) => {
    anime({
      targets: progressRef.current,
      width: `${value}%`,
      easing: 'linear',
      duration: 200,
    });
  };

  const handlePlayPause = () => {
    anime({
      targets: playBtnRef.current,
      scale: [1, 1.2, 1],
      duration: 300,
      easing: 'easeInOutQuad',
    });

    if (!sound) return;

    if (isPlaying) {
      sound.pause();
      clearInterval(intervalRef.current);
    } else {
      sound.play();
      intervalRef.current = setInterval(() => {
        const newProgress = (sound.seek() / sound.duration()) * 100;
        setProgress(newProgress);
        animateProgress(newProgress);
      }, 500);
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 p-4 shadow-lg">
      <div className="flex items-center gap-4">
        <img
          src={song?.cover}
          alt={song?.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h4 className="text-md font-bold">{song?.title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-300">{song?.artist}</p>
          <div className="h-2 bg-gray-300 dark:bg-zinc-700 mt-2 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <button
          ref={playBtnRef}
          onClick={handlePlayPause}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
}
