'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useTheme, ThemeVariant } from '../../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { themeVariant, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const themeNames: Record<ThemeVariant, string> = {
    dark: 'Dark',
    light: 'Light',
    midnight: 'Midnight',
    sunset: 'Sunset',
    ocean: 'Ocean',
    forest: 'Forest',
    vinyl: 'Vinyl',
  };

  const themeColors: Record<ThemeVariant, { bg: string; accent: string }> = {
    dark: { bg: '#1a1a1a', accent: '#8b5cf6' },
    light: { bg: '#ffffff', accent: '#7c3aed' },
    midnight: { bg: '#1f2937', accent: '#3b82f6' },
    sunset: { bg: '#4a1f29', accent: '#f97316' },
    ocean: { bg: '#1e3a5f', accent: '#06b6d4' },
    forest: { bg: '#1e3a25', accent: '#10b981' },
    vinyl: { bg: '#1a1a1a', accent: '#cc5500' },
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-xl backdrop-blur-xl border transition-all duration-300"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
        }}
      >
        <Palette size={20} />
      </motion.button>

      {isOpen && typeof window !== 'undefined' && createPortal(
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0"
            style={{ zIndex: 9998 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-16 p-3 rounded-2xl backdrop-blur-2xl border min-w-50"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              boxShadow: `0 20px 60px var(--color-shadow)`,
              zIndex: 9999,
            }}
          >
            <h3
              className="text-sm font-semibold mb-3 px-2"
              style={{ color: 'var(--color-text)' }}
            >
              Choose Theme
            </h3>
            <div className="space-y-2">
              {availableThemes.map((theme) => (
                <motion.button
                  key={theme}
                  whileHover={{ x: 4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTheme(theme);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                  style={{
                    background:
                      themeVariant === theme
                        ? 'var(--color-surfaceHover)'
                        : 'transparent',
                    border: `2px solid ${
                      themeVariant === theme
                        ? 'var(--color-primary)'
                        : 'transparent'
                    }`,
                  }}
                >
                  <div className="flex gap-1">
                    <div
                      className="w-6 h-6 rounded-lg shadow-lg"
                      style={{
                        background: themeColors[theme].bg,
                      }}
                    />
                    <div
                      className="w-6 h-6 rounded-lg shadow-lg"
                      style={{
                        background: themeColors[theme].accent,
                      }}
                    />
                  </div>
                  <span
                    className="font-medium"
                    style={{
                      color:
                        themeVariant === theme
                          ? 'var(--color-primary)'
                          : 'var(--color-text)',
                    }}
                  >
                    {themeNames[theme]}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>,
        document.body
      )}
    </div>
  );
};

export default ThemeSwitcher;
