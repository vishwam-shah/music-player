'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeVariant = 'dark' | 'light' | 'midnight' | 'sunset' | 'ocean' | 'forest' | 'vinyl';

interface Theme {
  name: ThemeVariant;
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    text: string;
    textMuted: string;
    border: string;
    shadow: string;
  };
}

const themes: Record<ThemeVariant, Theme> = {
  dark: {
    name: 'dark',
    colors: {
      background: '#0a0a0a',
      surface: 'rgba(20, 20, 20, 0.9)',
      surfaceHover: 'rgba(30, 30, 30, 0.95)',
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#ec4899',
      accent: '#06b6d4',
      text: '#ffffff',
      textMuted: '#9ca3af',
      border: 'rgba(255, 255, 255, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
  },
  light: {
    name: 'light',
    colors: {
      background: '#f9fafb',
      surface: 'rgba(255, 255, 255, 0.95)',
      surfaceHover: 'rgba(249, 250, 251, 0.98)',
      primary: '#7c3aed',
      primaryHover: '#6d28d9',
      secondary: '#db2777',
      accent: '#0891b2',
      text: '#1f2937',
      textMuted: '#4b5563',
      border: 'rgba(0, 0, 0, 0.15)',
      shadow: 'rgba(0, 0, 0, 0.2)',
    },
  },
  midnight: {
    name: 'midnight',
    colors: {
      background: '#030712',
      surface: 'rgba(17, 24, 39, 0.9)',
      surfaceHover: 'rgba(31, 41, 55, 0.95)',
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      text: '#f3f4f6',
      textMuted: '#9ca3af',
      border: 'rgba(59, 130, 246, 0.2)',
      shadow: 'rgba(59, 130, 246, 0.3)',
    },
  },
  sunset: {
    name: 'sunset',
    colors: {
      background: '#1a0b0f',
      surface: 'rgba(40, 20, 25, 0.9)',
      surfaceHover: 'rgba(60, 30, 35, 0.95)',
      primary: '#f97316',
      primaryHover: '#ea580c',
      secondary: '#ec4899',
      accent: '#fbbf24',
      text: '#fef3c7',
      textMuted: '#fca5a5',
      border: 'rgba(249, 115, 22, 0.2)',
      shadow: 'rgba(249, 115, 22, 0.3)',
    },
  },
  ocean: {
    name: 'ocean',
    colors: {
      background: '#0c1821',
      surface: 'rgba(20, 40, 60, 0.9)',
      surfaceHover: 'rgba(30, 50, 70, 0.95)',
      primary: '#06b6d4',
      primaryHover: '#0891b2',
      secondary: '#3b82f6',
      accent: '#14b8a6',
      text: '#e0f2fe',
      textMuted: '#67e8f9',
      border: 'rgba(6, 182, 212, 0.2)',
      shadow: 'rgba(6, 182, 212, 0.3)',
    },
  },
  forest: {
    name: 'forest',
    colors: {
      background: '#0a1a0f',
      surface: 'rgba(20, 40, 25, 0.9)',
      surfaceHover: 'rgba(30, 50, 35, 0.95)',
      primary: '#10b981',
      primaryHover: '#059669',
      secondary: '#34d399',
      accent: '#fbbf24',
      text: '#d1fae5',
      textMuted: '#86efac',
      border: 'rgba(16, 185, 129, 0.2)',
      shadow: 'rgba(16, 185, 129, 0.3)',
    },
  },
  vinyl: {
    name: 'vinyl',
    colors: {
      background: '#1a1a1a',
      surface: 'rgba(45, 45, 45, 0.9)',
      surfaceHover: 'rgba(60, 60, 60, 0.95)',
      primary: '#cc5500',
      primaryHover: '#b84800',
      secondary: '#b87333',
      accent: '#ffbf00',
      text: '#f5e6d3',
      textMuted: '#d4af37',
      border: 'rgba(204, 85, 0, 0.2)',
      shadow: 'rgba(204, 85, 0, 0.3)',
    },
  },
};

interface ThemeContextType {
  theme: Theme;
  themeVariant: ThemeVariant;
  setTheme: (variant: ThemeVariant) => void;
  availableThemes: ThemeVariant[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>('dark');

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem('theme') as ThemeVariant;
    if (saved && themes[saved]) {
      setThemeVariant(saved);
    }
  }, []);

  useEffect(() => {
    // Apply theme CSS variables
    const theme = themes[themeVariant];
    const root = document.documentElement;
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Save theme preference
    localStorage.setItem('theme', themeVariant);
  }, [themeVariant]);

  const setTheme = (variant: ThemeVariant) => {
    setThemeVariant(variant);
  };

  const value: ThemeContextType = {
    theme: themes[themeVariant],
    themeVariant,
    setTheme,
    availableThemes: Object.keys(themes) as ThemeVariant[],
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
