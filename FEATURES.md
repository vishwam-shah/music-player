# MusicWave - Modern Futuristic Music Player

A stunning, feature-rich music player built with Next.js 15, React 19, and modern web technologies.

## ✨ Features

### 🎵 Core Music Playback
- **Full Playback Controls**: Play, pause, skip forward/backward, seek
- **Volume Control**: Adjustable volume with mute/unmute toggle
- **Queue Management**: Add, remove, and reorder songs in queue
- **Shuffle & Repeat**: Multiple playback modes (shuffle, repeat all, repeat one)
- **Progress Tracking**: Real-time progress bar with time display

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful glass-effect cards and panels
- **Gradient Accents**: Eye-catching purple, pink, and cyan gradients
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Fully responsive from mobile to 4K displays
- **Dark Theme**: Elegant dark mode with perfect contrast

### 🎤 Advanced Features

#### Lyrics Display
- Synchronized lyrics with auto-scroll
- Highlighted current line
- Smooth transitions between lines
- Expandable/collapsible panel

#### Music Visualizer
- Real-time audio visualization
- Animated bars with gradient colors
- Can be toggled on/off

#### Playlist Management
- Create custom playlists
- Add/remove songs from playlists
- Organize your music collection
- Persistent storage via localStorage

#### Smart Features
- **Favorites System**: Like songs and access them quickly
- **Recently Played**: Automatic tracking of listening history
- **Advanced Search**: Search by title, artist, or album
- **Genre Filters**: Filter songs by genre
- **Multiple Sort Options**: Sort by title, artist, date added, or popularity

### 📱 Mobile App Experience

#### Progressive Web App (PWA)
- Install as a native app on mobile/desktop
- Offline support with service workers
- App-like interface and navigation
- Fast loading and smooth performance

#### Mobile Optimizations
- Touch-friendly controls
- Swipe gestures support
- Collapsible sidebar
- Optimized for small screens
- Native app status bar theming

### 🎯 Additional Features
- **Download Songs**: Download music for offline listening
- **Share Songs**: Share your favorite tracks with friends
- **Grid/List View**: Toggle between different view modes
- **Expanded Player**: Full-screen player mode with album art
- **Now Playing Indicator**: Visual indicator for currently playing song
- **Keyboard Shortcuts**: Control playback with keyboard (coming soon)

## 🎨 Design Highlights

### Color Scheme
- Primary: Purple/Violet (#8b5cf6)
- Secondary: Pink (#ec4899)
- Accent: Cyan (#06b6d4)
- Background: Deep black with purple gradient

### Typography
- System fonts for optimal performance
- Clear hierarchy and readability
- Smooth font rendering

### Animations
- Hover effects on all interactive elements
- Smooth page transitions
- Loading states and skeletons
- Floating and pulse animations
- Gradient animations

## 🚀 Technology Stack

- **Framework**: Next.js 15.3.0 with App Router
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 4.1.3
- **Audio**: Howler.js 2.2.4
- **Animations**:
  - Framer Motion 12.6.5
  - Anime.js 3.2.2
- **Icons**: Lucide React
- **Language**: JavaScript/TypeScript

## 📦 Project Structure

```
music-player/
├── src/
│   ├── app/
│   │   ├── layout.jsx         # Root layout with PWA support
│   │   ├── page.jsx           # Main application page
│   │   └── globals.css        # Global styles and animations
│   ├── components/
│   │   ├── EnhancedMusicPlayer.jsx    # Main player component
│   │   ├── EnhancedTrackList.jsx      # Song grid/list view
│   │   ├── EnhancedSidebar.jsx        # Navigation sidebar
│   │   ├── EnhancedHeader.jsx         # Search and filters
│   │   ├── LyricsPanel.jsx            # Lyrics display
│   │   ├── QueuePanel.jsx             # Queue management
│   │   └── MusicVisualizer.jsx        # Audio visualizer
│   ├── context/
│   │   └── AudioContext.jsx   # Global audio state management
│   └── data/
│       └── songs.json         # Music library data
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── assets/                # Images and audio files
└── package.json

```

## 🎯 Use Cases

1. **Personal Music Library**: Organize and play your music collection
2. **Playlist Creation**: Create playlists for different moods
3. **Music Discovery**: Browse and discover new tracks
4. **Offline Listening**: Download songs for offline playback
5. **Party Mode**: Full-screen player with visualizer
6. **Lyrics Learning**: Follow along with synchronized lyrics

## 🔮 Future Enhancements

- Audio equalizer with presets
- Crossfade between songs
- Gapless playback
- Social features (share playlists)
- Music recommendations AI
- Integration with streaming APIs
- Keyboard shortcuts
- Gesture controls
- Mini player mode
- Sleep timer

## 🎉 Why MusicWave?

- **Modern & Futuristic**: Cutting-edge design that stands out
- **Feature-Rich**: More features than many commercial players
- **Fast & Smooth**: Optimized performance with smooth animations
- **Mobile-First**: Perfect experience on all devices
- **Free & Open**: No subscriptions, no ads, completely free
- **Privacy-Focused**: All data stored locally, no tracking

---

Built with ❤️ using Next.js and modern web technologies
