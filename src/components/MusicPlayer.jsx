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
      <div className="flex items-center gap-4 mb-2">
        <img src={song?.cover} alt={song?.title} className="w-14 h-14 rounded-lg" />
        {/* <div className="relative flex justify-center items-center w-14 h-14 z-10 mb-4">
           <img
               src={song?.cover} // Make sure this image exists in /public/images
               alt="Vinyl Player"
               className="w-120 h-120 object-contain"
             />
           </div> */}
        <div className="flex-1">
          <div className="font-bold">{song?.title}</div>
          <div className="text-sm">{song?.artist}</div>
        </div>
        <div className="flex items-center gap-4">
          <SkipBack className="cursor-pointer" />
          <button onClick={handlePlayPause} className="bg-white text-black p-2 rounded-full">
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <SkipForward className="cursor-pointer" />
        </div>
      </div>
      <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
        <div ref={progressRef} className="bg-green-500 h-full w-0"></div>
      </div>
    </div>
  );
}
