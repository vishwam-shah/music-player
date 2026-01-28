'use client';

import React, { useContext, useState, useRef, useCallback, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { PlayerContext } from '../../context/PlayerContext';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import type { PlayerContextType } from '../../types';

interface VolumeKnobProps {
  size?: number;
}

export default function VolumeKnob({ size = 48 }: VolumeKnobProps) {
  const { volume, isMuted, setVolume, toggleMute } = useContext(PlayerContext) as PlayerContextType;
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);

  const rotation = (volume * 270) - 135;

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      if (!knobRef.current) return;

      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(
        moveEvent.clientY - centerY,
        moveEvent.clientX - centerX
      );

      let degrees = (angle * 180) / Math.PI + 90;
      if (degrees < 0) degrees += 360;

      let newVolume: number;
      if (degrees >= 45 && degrees <= 315) {
        newVolume = (degrees - 45) / 270;
      } else if (degrees < 45) {
        newVolume = 0;
      } else {
        newVolume = 1;
      }

      setVolume(Math.max(0, Math.min(1, newVolume)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [setVolume]);

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleMute}
        className="p-1 rounded hover:bg-white/10 transition-colors"
        style={{ color: isMuted ? 'var(--danger)' : 'var(--warm-cream)' }}
      >
        <VolumeIcon size={18} />
      </button>

      <div
        ref={knobRef}
        className="relative cursor-pointer select-none"
        style={{
          width: size,
          height: size
        }}
        onMouseDown={handleMouseDown}
      >
        <svg
          className="absolute inset-0"
          viewBox="0 0 48 48"
          style={{ width: size, height: size }}
        >
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="var(--vinyl-groove)"
            strokeWidth="4"
            strokeDasharray="103.67 34.56"
            transform="rotate(135 24 24)"
          />

          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="var(--copper)"
            strokeWidth="4"
            strokeDasharray={`${volume * 103.67} 138.23`}
            transform="rotate(135 24 24)"
            style={{
              filter: isDragging ? 'drop-shadow(0 0 4px var(--amber-glow))' : 'none'
            }}
          />

          {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
            const tickAngle = (tick * 270 - 135) * (Math.PI / 180);
            const x1 = 24 + 18 * Math.cos(tickAngle);
            const y1 = 24 + 18 * Math.sin(tickAngle);
            const x2 = 24 + 22 * Math.cos(tickAngle);
            const y2 = 24 + 22 * Math.sin(tickAngle);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--text-muted)"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        <motion.div
          className="absolute rounded-full"
          style={{
            top: 6,
            left: 6,
            right: 6,
            bottom: 6,
            background: 'var(--surface-elevated)',
            border: '2px solid var(--walnut)',
            boxShadow: `
              0 2px 8px rgba(0,0,0,0.4),
              inset 0 1px 2px rgba(255,255,255,0.1),
              inset 0 -2px 4px rgba(0,0,0,0.2)
            `
          }}
          animate={{ rotate: rotation }}
          transition={{
            type: isDragging ? 'tween' : 'spring',
            duration: isDragging ? 0 : 0.3,
            stiffness: 300,
            damping: 25
          }}
        >
          <div
            className="absolute top-1 left-1/2 -translate-x-1/2"
            style={{
              width: 3,
              height: 8,
              background: 'var(--copper)',
              borderRadius: 2
            }}
          />
        </motion.div>

        <div
          className="absolute rounded-full"
          style={{
            top: '35%',
            left: '35%',
            right: '35%',
            bottom: '35%',
            background: 'var(--vinyl-groove)',
            border: '1px solid var(--walnut)'
          }}
        />
      </div>

      <div
        className="text-xs font-mono w-8 text-right"
        style={{ color: 'var(--text-secondary)' }}
      >
        {Math.round(volume * 100)}
      </div>
    </div>
  );
}

export function VolumeSlider() {
  const { volume, isMuted, setVolume, toggleMute } = useContext(PlayerContext) as PlayerContextType;

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="p-1 rounded hover:bg-white/10 transition-colors"
        style={{ color: isMuted ? 'var(--danger)' : 'var(--warm-cream)' }}
      >
        <VolumeIcon size={16} />
      </button>

      <input
        type="range"
        min="0"
        max="100"
        value={isMuted ? 0 : volume * 100}
        onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
        className="retro-slider w-20"
      />
    </div>
  );
}
