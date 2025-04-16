// src/components/AlbumArt.js
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const AlbumArt = ({ isPlaying, coverImage }) => {
  const artRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      if (!animationRef.current) {
        animationRef.current = anime({
          targets: artRef.current,
          rotate: '360',
          duration: 4000,
          easing: 'linear',
          loop: true,
        });
      } else {
        animationRef.current.play();
      }
    } else {
      animationRef.current?.pause();
    }
  }, [isPlaying]);

  return (
    <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl">
      <img
        ref={artRef}
        src={coverImage || '/default.jpg'}
        alt="Album Art"
        className="w-full h-full object-cover"
        style={{ transformOrigin: 'center' }}
      />
    </div>
  );
};

export default AlbumArt;
