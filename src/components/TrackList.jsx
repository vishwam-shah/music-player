import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
// import vinylImage from '../assets/Vinyl-record1.png';

export default function TrackList({ songs, onSelect }) {
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, songs.length);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [100, 0],
              easing: 'easeOutExpo',
              duration: 1000,
              delay: i * 250,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    cardsRef.current.forEach((card) => card && observer.observe(card));
    return () => cardsRef.current.forEach((card) => card && observer.unobserve(card));
  }, [songs]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {songs.map((song, index) => (
        <div
          key={index}
          ref={(el) => (cardsRef.current[index] = el)}
          className="p-4 bg-purple-700 rounded-xl flex flex-col items-center cursor-pointer opacity-0"
          onClick={() => onSelect(song)}
        >
          <div className="text-white font-semibold mb-2">{song.title}</div>
          <div className="relative flex justify-center items-center w-40 h-40 z-10 mb-4">
           <img
               src="/images/Vinyl-record1.png" // Make sure this image exists in /public/images
               alt="Vinyl Player"
               className="w-120 h-120 object-contain"
             />
           </div>
          <div className="text-sm text-white">{song.artist}</div>
        </div>
      ))}
    </div>
  );
}
