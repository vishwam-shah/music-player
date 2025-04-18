import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

export default function TrackList({ songs, onSelect }) {
  const cardsRef = useRef([]);

  // useEffect(() => {
  //   cardsRef.current = cardsRef.current.slice(0, songs.length);

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry, i) => {
  //         if (entry.isIntersecting) {
  //           anime({
  //             targets: entry.target,
  //             opacity: [0, 1],
  //             scale: [0.6, 1],
  //             rotate: [-360, 0], // CD spin
  //             easing: 'easeOutExpo',
  //             duration: 1200,
  //             delay: i * 100,
  //           });
  //           observer.unobserve(entry.target);
  //         }
  //       });
  //     },
  //     { threshold: 0.3 }
  //   );

  //   cardsRef.current.forEach((card) => {
  //     if (card) observer.observe(card);
  //   });

  //   return () => {
  //     cardsRef.current.forEach((card) => {
  //       if (card) observer.unobserve(card);
  //     });
  //   };
  // }, [songs]);

  useEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, songs.length);
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [100, 0], // Fly in from bottom
              easing: 'easeOutExpo',
              duration: 1000,
              delay: i * 100,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
  
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });
  
    return () => {
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [songs]);
  

  const handleClick = (song) => {
    onSelect(song);
  };

  return (
    <div className="track-list grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {songs.map((song, index) => (
        <div
          key={index}
          ref={(el) => (cardsRef.current[index] = el)}
          className="track-card relative flex flex-col items-center p-4 m-2 bg-purple-700 rounded-xl w-48 h-64 cursor-pointer shadow-lg opacity-0 transition-transform"
          onClick={() => handleClick(song)}
        >
          {/* Song Title Above the Vinyl */}
          <div className="w-full flex justify-center items-center z-20 text-white text-lg font-semibold mb-2">
            {song.title}
          </div>

          {/* Vinyl Player Image */}
          <div className="relative flex justify-center items-center w-40 h-40 z-10 mb-4">
          <img
              src="/images/Vinyl-record1.png" // Make sure this image exists in /public/images
              alt="Vinyl Player"
              className="w-120 h-120 object-contain"
            />
          </div>

          {/* Song Details Below the Vinyl */}
          <div className="w-full flex justify-center items-center text-white text-sm font-medium">
            <p>{song.artist}</p>
          </div>

          {/* Hidden Details for Accessibility */}
          <div className="sr-only">
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
