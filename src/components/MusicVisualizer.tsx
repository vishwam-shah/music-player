"use client";
import React, { useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';

const MusicVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const { isPlaying } = useAudio();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const bars = 64;
    let dataArray = new Array(bars).fill(0);

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      if (!isPlaying) {
        dataArray = dataArray.map(val => val * 0.95);
      } else {
        dataArray = dataArray.map((val, i) => {
          const target = Math.random() * 255;
          return val + (target - val) * 0.1;
        });
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / bars;

      dataArray.forEach((value, i) => {
        const barHeight = (value / 255) * canvas.height * 0.8;
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        const gradient = ctx.createLinearGradient(x, canvas.height, x, y);
        gradient.addColorStop(0, '#8b5cf6');
        gradient.addColorStop(0.5, '#ec4899');
        gradient.addColorStop(1, '#06b6d4');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, barHeight);

        ctx.shadowBlur = 20;
        ctx.shadowColor = '#8b5cf6';
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return <canvas ref={canvasRef} className="w-full h-32" />;
};

export default MusicVisualizer;
