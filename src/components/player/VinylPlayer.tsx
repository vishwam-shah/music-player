'use client';

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { PlayerContext } from '../../context/PlayerContext';
import type { PlayerContextType } from '../../types';

interface VinylPlayerProps {
  size?: 'sm' | 'md' | 'lg';
}

interface SizeConfig {
  vinyl: number;
  label: number;
  tonearm: number;
}

export default function VinylPlayer({ size = 'lg' }: VinylPlayerProps) {
  const { currentSong, isPlaying } = useContext(PlayerContext) as PlayerContextType;

  const sizes: Record<string, SizeConfig> = {
    sm: { vinyl: 120, label: 40, tonearm: 60 },
    md: { vinyl: 180, label: 60, tonearm: 90 },
    lg: { vinyl: 280, label: 90, tonearm: 140 }
  };

  const s = sizes[size] || sizes.lg;

  return (
    <div className="relative flex items-center justify-center" style={{ width: s.vinyl + 60, height: s.vinyl + 20 }}>
      <div
        className="absolute rounded-lg wood-texture"
        style={{
          width: s.vinyl + 40,
          height: s.vinyl + 40,
          background: 'var(--walnut)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: s.vinyl + 20,
          height: s.vinyl + 20,
          background: 'var(--vinyl-groove)',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
        }}
      />

      <motion.div
        className={`relative rounded-full ${isPlaying ? 'vinyl-spinning' : ''}`}
        style={{
          width: s.vinyl,
          height: s.vinyl,
          background: `
            radial-gradient(circle at center,
              var(--vinyl-black) 0%,
              var(--vinyl-black) 15%,
              #1a1a1a 15.5%,
              #0d0d0d 16%,
              #1a1a1a 16.5%,
              #0d0d0d 20%,
              #1a1a1a 20.5%,
              #0d0d0d 25%,
              #1a1a1a 25.5%,
              #0d0d0d 30%,
              #1a1a1a 30.5%,
              #0d0d0d 35%,
              #1a1a1a 35.5%,
              #0d0d0d 40%,
              #1a1a1a 40.5%,
              #0d0d0d 45%,
              #1a1a1a 45.5%,
              #0d0d0d 50%,
              #1a1a1a 50.5%,
              var(--vinyl-black) 100%
            )
          `,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: s.label,
            height: s.label,
            background: currentSong?.cover ? 'none' : 'var(--label-red)',
            border: '2px solid var(--gold-accent)'
          }}
        >
          {currentSong?.cover ? (
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-[8px] text-warm-cream font-bold">
              VINYL
            </div>
          )}
        </div>

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 8,
            height: 8,
            background: 'var(--vinyl-groove)',
            border: '1px solid var(--gold-accent)'
          }}
        />

        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: s.vinyl * 0.8,
            height: s.vinyl * 0.8,
            top: '10%',
            left: '10%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%)',
            borderRadius: '50%'
          }}
        />
      </motion.div>

      <div
        className="absolute"
        style={{
          right: -10,
          top: 10,
          width: s.tonearm,
          height: s.tonearm,
          transformOrigin: 'top right'
        }}
      >
        <div
          className="absolute top-0 right-0 rounded-full"
          style={{
            width: 24,
            height: 24,
            background: 'var(--needle-silver)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
          }}
        />

        <motion.div
          className="absolute top-3 right-3"
          style={{
            width: s.tonearm - 20,
            transformOrigin: 'top left'
          }}
          animate={{
            rotate: isPlaying ? 25 : 0
          }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 15
          }}
        >
          <div
            style={{
              width: s.tonearm - 30,
              height: 6,
              background: 'var(--needle-silver)',
              borderRadius: 3,
              transform: 'rotate(45deg)',
              transformOrigin: 'left center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          />

          <div
            className="absolute"
            style={{
              left: (s.tonearm - 30) * 0.7,
              top: (s.tonearm - 30) * 0.7 - 8,
              width: 16,
              height: 8,
              background: 'var(--needle-silver)',
              borderRadius: 2,
              transform: 'rotate(45deg)'
            }}
          />

          <motion.div
            className="absolute"
            style={{
              left: (s.tonearm - 30) * 0.7 + 12,
              top: (s.tonearm - 30) * 0.7 - 2,
              width: 2,
              height: 8,
              background: 'var(--gold-accent)',
              transformOrigin: 'top center'
            }}
            animate={{
              scaleY: isPlaying ? 1 : 0.5,
              opacity: isPlaying ? 1 : 0.6
            }}
          />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-2 left-4 rounded-full"
        style={{
          width: 8,
          height: 8,
          background: isPlaying ? 'var(--amber-glow)' : 'var(--vinyl-groove)'
        }}
        animate={{
          boxShadow: isPlaying
            ? '0 0 8px var(--amber-glow), 0 0 16px var(--burnt-orange)'
            : 'none'
        }}
      />
    </div>
  );
}
