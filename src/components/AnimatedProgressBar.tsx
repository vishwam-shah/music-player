'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface Props {
  progress: number;
}

const AnimatedProgressBar = ({ progress }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    anime({
      targets: ref.current,
      width: `${progress}%`,
      duration: 400,
      easing: 'easeOutQuad',
    });
  }, [progress]);

  return (
    <div className="w-full h-2 bg-gray-200 rounded">
      <div
        ref={ref}
        className="h-full bg-blue-500 rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default AnimatedProgressBar;
