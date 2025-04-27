import React, { useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import anime from 'animejs';

export default function MusicPlayer({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

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

  const handlePlayPause = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
      clearInterval(intervalRef.current);
    } else {
      sound.play();
      intervalRef.current = setInterval(() => {
        const newProgress = (sound.seek() / sound.duration()) * 100;
        setProgress(newProgress);
        anime({
          targets: progressRef.current,
          width: `${newProgress}%`,
          duration: 200,
          easing: 'linear',
        });
      }, 500);
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-800 p-4 text-white z-50">
  <div className="flex items-center justify-between mb-2">
    {/* Left side: Album art + Now Playing info */}
    <div className="flex items-center gap-4">
      <img src={song?.cover} alt={song?.title} className="w-14 h-14 rounded-lg" />
      <div className="flex flex-col gap-1">
        <div className="text-sm text-gray-400">Now Playing</div>
        <div className="font-bold">{song?.title}</div>
        <div className="text-sm">{song?.artist}</div>
      </div>
    </div>

    {/* Center: Playback controls */}
    <div className="flex items-center justify-center gap-6">
      <SkipBack className="cursor-pointer" />
      <button onClick={handlePlayPause} className="bg-white text-black p-2 rounded-full cursor-pointer">
        {isPlaying ? <Pause /> : <Play />}
      </button>
      <SkipForward className="cursor-pointer" />
    </div>
  </div>

  {/* Progress bar */}
  <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
    <div ref={progressRef} className="bg-green-500 h-full w-0"></div>
  </div>
</div>
  );
}