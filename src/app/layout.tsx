import './globals.css';
import { ReactNode } from 'react';
import { FavoritesProvider } from '../context/FavoritesContext';
import { PlayerProvider } from '../context/PlayerContext';
import { PlaylistProvider } from '../context/PlaylistContext';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata = {
  title: 'Vinyl - Music Player',
  description: 'A retro-styled music player with modern features',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <FavoritesProvider>
            <PlaylistProvider>
              <PlayerProvider>
                {children}
              </PlayerProvider>
            </PlaylistProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
