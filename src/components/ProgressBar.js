// src/components/ProgressBar.js
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const ProgressBar = ({ progress }) => {
  const fillRef = useRef(null);

  useEffect(() => {
    anime({
      targets: fillRef.current,
      width: `${progress}%`,
      duration: 300,
      easing: 'easeOutQuad',
    });
  }, [progress]);

  return (
    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-4">
      <div
        ref={fillRef}
        className="h-full bg-blue-500 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
