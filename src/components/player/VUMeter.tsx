'use client';

import React, { useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PlayerContext } from '../../context/PlayerContext';
import type { PlayerContextType, VUData } from '../../types';

interface VUMeterProps {
  variant?: 'dual' | 'bars' | 'single';
}

interface SingleVUMeterProps {
  value: number;
  label: string;
  isPlaying: boolean;
}

interface BarVUMeterProps {
  vuData: VUData;
  isPlaying: boolean;
}

export default function VUMeter({ variant = 'dual' }: VUMeterProps) {
  const { vuData, isPlaying } = useContext(PlayerContext) as PlayerContextType;

  if (variant === 'dual') {
    return (
      <div className="flex gap-4">
        <SingleVUMeter value={vuData.left} label="L" isPlaying={isPlaying} />
        <SingleVUMeter value={vuData.right} label="R" isPlaying={isPlaying} />
      </div>
    );
  }

  if (variant === 'bars') {
    return <BarVUMeter vuData={vuData} isPlaying={isPlaying} />;
  }

  return <SingleVUMeter value={vuData.average} label="VU" isPlaying={isPlaying} />;
}

function SingleVUMeter({ value, label, isPlaying }: SingleVUMeterProps) {
  const rotation = useMemo(() => {
    const baseRotation = -45;
    const range = 90;
    return baseRotation + (value * range);
  }, [value]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 100,
        height: 60,
        background: 'var(--warm-cream)',
        borderRadius: '8px 8px 50% 50% / 8px 8px 100% 100%',
        border: '3px solid var(--walnut)',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
      }}
    >
      <svg
        className="absolute inset-0"
        viewBox="0 0 100 60"
        style={{ overflow: 'visible' }}
      >
        <path
          d="M 15 55 Q 50 -5 85 55"
          fill="none"
          stroke="var(--vinyl-groove)"
          strokeWidth="1"
          opacity="0.3"
        />

        {[-40, -20, 0, 20, 40].map((angle, i) => {
          const radians = (angle - 90) * (Math.PI / 180);
          const x1 = 50 + 35 * Math.cos(radians);
          const y1 = 55 + 35 * Math.sin(radians);
          const x2 = 50 + 42 * Math.cos(radians);
          const y2 = 55 + 42 * Math.sin(radians);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i >= 3 ? 'var(--danger)' : 'var(--vinyl-black)'}
              strokeWidth={i === 2 ? 2 : 1}
            />
          );
        })}

        <path
          d="M 70 35 Q 85 15 92 55"
          fill="none"
          stroke="var(--danger)"
          strokeWidth="8"
          opacity="0.3"
        />
      </svg>

      <div
        className="absolute text-xs font-bold"
        style={{
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'var(--vinyl-black)'
        }}
      >
        {label}
      </div>

      <div
        className="absolute"
        style={{
          bottom: 5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 8,
          height: 8,
          background: 'var(--vinyl-black)',
          borderRadius: '50%',
          zIndex: 10
        }}
      />

      <motion.div
        className="absolute"
        style={{
          bottom: 8,
          left: '50%',
          width: 2,
          height: 40,
          background: 'var(--vinyl-black)',
          transformOrigin: 'bottom center',
          borderRadius: '1px 1px 0 0',
          boxShadow: '1px 0 2px rgba(0,0,0,0.3)'
        }}
        animate={{
          rotate: isPlaying ? rotation : -45
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{
            width: 6,
            height: 6,
            background: 'var(--danger)',
            borderRadius: '50%'
          }}
        />
      </motion.div>
    </div>
  );
}

function BarVUMeter({ vuData, isPlaying }: BarVUMeterProps) {
  const bars = 16;

  const getBarHeight = (index: number): number => {
    if (!isPlaying) return 10;

    const position = index / bars;
    const bassBoost = Math.max(0, 1 - position * 2);
    const trebleBoost = Math.max(0, position * 2 - 1);
    const midRange = 1 - Math.abs(position - 0.5) * 2;

    const base = vuData.average * 100;
    const variation = (Math.sin(Date.now() / 100 + index * 0.5) + 1) * 10;

    return Math.min(100, base * (1 + bassBoost * 0.5 + midRange * 0.3 + trebleBoost * 0.2) + variation);
  };

  return (
    <div
      className="flex items-end gap-1 p-3 rounded-lg"
      style={{
        background: 'var(--vinyl-black)',
        border: '2px solid var(--walnut)',
        height: 80
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const height = getBarHeight(i);
        const isHot = height > 80;
        const isWarm = height > 60;

        return (
          <motion.div
            key={i}
            className="w-2 rounded-sm"
            style={{
              background: isHot
                ? 'var(--danger)'
                : isWarm
                  ? 'var(--amber-glow)'
                  : 'var(--copper)',
              boxShadow: isHot
                ? '0 0 8px var(--danger)'
                : isWarm
                  ? '0 0 4px var(--amber-glow)'
                  : 'none'
            }}
            animate={{
              height: `${height}%`
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25
            }}
          />
        );
      })}
    </div>
  );
}

export function CompactVUMeter() {
  const { vuData, isPlaying } = useContext(PlayerContext) as PlayerContextType;

  const level = isPlaying ? vuData.average * 100 : 0;

  return (
    <div
      className="relative h-2 rounded overflow-hidden"
      style={{
        width: 60,
        background: 'var(--vinyl-groove)'
      }}
    >
      <motion.div
        className="absolute left-0 top-0 h-full rounded"
        style={{
          background: level > 80 ? 'var(--danger)' : level > 60 ? 'var(--amber-glow)' : 'var(--copper)'
        }}
        animate={{
          width: `${level}%`
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30
        }}
      />
    </div>
  );
}
