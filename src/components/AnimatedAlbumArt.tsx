'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface Props {
  isPlaying: boolean;
  imageUrl: string;
}

const AnimatedAlbumArt = ({ isPlaying, imageUrl }: Props) => {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const animation = anime({
      targets: ref.current,
      rotate: '360',
      duration: 6000,
      easing: 'linear',
      loop: true,
      autoplay: false,
    });

    isPlaying ? animation.play() : animation.pause();

    return () => animation.pause();
  }, [isPlaying]);

  return (
    <img
      ref={ref}
      src={imageUrl}
      alt="Album Art"
      className="rounded-full w-40 h-40 object-cover"
      style={{ transformOrigin: 'center center' }}
    />
  );
};

export default AnimatedAlbumArt;
