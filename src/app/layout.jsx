// app/layout.jsx
import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'MusicWave - Futuristic Music Player',
  description: 'A modern, futuristic music player with advanced features, lyrics, playlists, and stunning UI. Play unlimited music for free.',
  keywords: 'music player, streaming, lyrics, playlist, free music, audio player, online music',
  authors: [{ name: 'MusicWave' }],
  creator: 'MusicWave',
  publisher: 'MusicWave',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MusicWave',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  openGraph: {
    type: 'website',
    title: 'MusicWave - Futuristic Music Player',
    description: 'Experience music like never before with our advanced futuristic player',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MusicWave - Futuristic Music Player',
    description: 'Experience music like never before with our advanced futuristic player',
    images: ['/og-image.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#8b5cf6',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MusicWave" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        {children}

        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful');
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
