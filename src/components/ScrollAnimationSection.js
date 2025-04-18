// components/ScrollAnimationSection.js
'use client';
import React, { useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';

export default function ScrollAnimationSection() {
  useEffect(() => {
    const [container] = anime.utils.$('.scroll-container');
    const [timerElement] = anime.utils.$('.timer');
    const circles = anime.utils.$('.circle');
    const debug = true;

    // Square animation on scroll
    anime({
      targets: '.square',
      x: '15rem',
      rotate: '1turn',
      duration: 2000,
      direction: 'alternate',
      loop: true,
      autoplay: anime.onScroll({ container, debug }),
    });

    // Timer animation
    anime.createTimer({
      duration: 2000,
      direction: 'alternate',
      loop: true,
      onUpdate: self => {
        if (timerElement) timerElement.innerHTML = self.iterationCurrentTime.toFixed(0);
      },
      autoplay: anime.onScroll({
        target: timerElement?.parentNode,
        container,
        debug
      }),
    });

    // Timeline animation
    anime.createTimeline({
      direction: 'alternate',
      loop: true,
      autoplay: anime.onScroll({
        target: circles[0],
        container,
        debug
      }),
    })
    .add(circles[2], { x: '9rem' })
    .add(circles[1], { x: '9rem' })
    .add(circles[0], { x: '9rem' });
  }, []);

  return (
    <div className="scroll-container overflow-y-scroll h-[80vh] space-y-12 p-8 bg-black text-white">
      <div className="square w-24 h-24 bg-pink-500 rounded-md" />
      <div className="timer text-xl mt-10">0</div>
      <div className="flex space-x-6 mt-10">
        <div className="circle w-16 h-16 bg-purple-500 rounded-full" />
        <div className="circle w-16 h-16 bg-blue-500 rounded-full" />
        <div className="circle w-16 h-16 bg-green-500 rounded-full" />
      </div>
    </div>
  );
}
