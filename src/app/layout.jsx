// app/layout.jsx
import './globals.css';
import { FavoritesProvider } from '../context/FavoritesContext';

export const metadata = {
  title: 'Music Player',
  description: 'Web Music Player App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FavoritesProvider>{children}</FavoritesProvider>
      </body>
    </html>
  );
}
