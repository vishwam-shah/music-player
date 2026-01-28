"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PlayerContext } from "../../context/PlayerContext";
import type { PlayerContextType } from "../../types";

interface VisualEqualizerProps {
  barCount?: number;
  variant?: 'default' | 'compact' | 'minimal';
}

export default function VisualEqualizer({ barCount = 32, variant = 'default' }: VisualEqualizerProps) {
  const { isPlaying } = useContext(PlayerContext) as PlayerContextType;
  const [frequencies, setFrequencies] = useState<number[]>(new Array(barCount).fill(0));
  const animationFrameRef = useRef<number | undefined>(undefined);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<{ array: Uint8Array | null }>({ array: null });

  useEffect(() => {
    // Get the audio context and analyzer from window (set up by audioEngine)
    const setupAnalyzer = async () => {
      try {
        // Access the audio context from the global window if available
        const audioContext = (window as any).audioContext || 
                           (window as any).webkitAudioContext ||
                           new (window.AudioContext || (window as any).webkitAudioContext)();
        
        if (!analyserRef.current) {
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.8;
          
          // Try to connect to existing audio elements
          const audioElements = document.querySelectorAll('audio');
          if (audioElements.length > 0) {
            try {
              const source = audioContext.createMediaElementSource(audioElements[0]);
              source.connect(analyser);
              analyser.connect(audioContext.destination);
            } catch (e) {
              // Audio element may already be connected
              console.log('Audio element connection exists');
            }
          }
          
          analyserRef.current = analyser;
          dataArrayRef.current.array = new Uint8Array(analyser.frequencyBinCount);
        }
      } catch (error) {
        console.error('Failed to setup analyzer:', error);
      }
    };

    setupAnalyzer();
  }, []);

  useEffect(() => {
    if (!isPlaying || !analyserRef.current || !dataArrayRef.current.array) {
      setFrequencies(new Array(barCount).fill(0));
      return;
    }

    const updateFrequencies = () => {
      if (!analyserRef.current || !dataArrayRef.current.array) return;

      // Use type assertion to bypass strict ArrayBuffer type checking
      const dataArray = dataArrayRef.current.array;
      (analyserRef.current.getByteFrequencyData as (array: Uint8Array) => void)(dataArray);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const step = Math.floor(bufferLength / barCount);
      const newFrequencies: number[] = [];

      for (let i = 0; i < barCount; i++) {
        const start = i * step;
        const end = start + step;
        let sum = 0;
        
        for (let j = start; j < end && j < dataArrayRef.current.array.length; j++) {
          sum += dataArrayRef.current.array[j];
        }
        
        const average = sum / step;
        newFrequencies.push(average / 255); // Normalize to 0-1
      }

      setFrequencies(newFrequencies);
      animationFrameRef.current = requestAnimationFrame(updateFrequencies);
    };

    animationFrameRef.current = requestAnimationFrame(updateFrequencies);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, barCount]);

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-0.5 h-6">
        {frequencies.map((freq, index) => (
          <motion.div
            key={index}
            className="flex-1 rounded-full"
            style={{
              background: `linear-gradient(to top, var(--copper), var(--amber-glow))`,
              opacity: 0.7,
            }}
            animate={{
              height: isPlaying ? `${Math.max(freq * 100, 5)}%` : '10%',
            }}
            transition={{
              duration: 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-end gap-1 h-12 px-2">
        {frequencies.map((freq, index) => (
          <motion.div
            key={index}
            className="flex-1 rounded-t"
            style={{
              background: freq > 0.7 
                ? 'var(--amber-glow)' 
                : freq > 0.4 
                ? 'var(--copper)' 
                : 'var(--burnt-orange)',
              minWidth: '2px',
            }}
            animate={{
              height: isPlaying ? `${Math.max(freq * 100, 2)}%` : '2%',
            }}
            transition={{
              duration: 0.05,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className="flex items-end gap-1 h-32 p-4 rounded-lg"
      style={{
        background: 'var(--vinyl-black)',
        border: '2px solid var(--walnut)',
      }}
    >
      {frequencies.map((freq, index) => (
        <div key={index} className="flex-1 flex flex-col justify-end items-center">
          <motion.div
            className="w-full rounded-t"
            style={{
              background: `linear-gradient(to top, 
                var(--burnt-orange) 0%, 
                var(--copper) 50%, 
                var(--amber-glow) 100%)`,
              minHeight: '4px',
            }}
            animate={{
              height: isPlaying ? `${Math.max(freq * 100, 3)}%` : '3%',
            }}
            transition={{
              duration: 0.05,
              ease: 'linear',
            }}
          />
        </div>
      ))}
    </div>
  );
}
