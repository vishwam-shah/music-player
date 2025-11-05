// Service to fetch music from free music APIs
const JAMENDO_CLIENT_ID = '56d30c95'; // Public client ID for demo purposes

class MusicAPIService {
  constructor() {
    this.baseURL = 'https://api.jamendo.com/v3.0';
    this.imageCache = new Map();
  }

  // Fetch tracks from Jamendo
  async fetchTracks(limit = 50, offset = 0) {
    try {
      const response = await fetch(
        `${this.baseURL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&offset=${offset}&include=musicinfo&imagesize=400&audioformat=mp32`
      );
      const data = await response.json();

      return data.results.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artist_name,
        album: track.album_name || 'Single',
        cover: track.album_image || track.image || this.getPlaceholderImage(),
        audio: track.audio || track.audiodownload,
        duration: this.formatDuration(track.duration),
        genre: track.musicinfo?.tags?.genres?.[0] || 'Electronic',
        releaseDate: track.releasedate,
        license: track.license_ccurl,
        downloadUrl: track.audiodownload,
        shareUrl: track.shareurl,
        lyrics: this.generateSampleLyrics(track.name)
      }));
    } catch (error) {
      console.error('Error fetching tracks:', error);
      return this.getFallbackTracks();
    }
  }

  // Search tracks
  async searchTracks(query, limit = 30) {
    try {
      const response = await fetch(
        `${this.baseURL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}&include=musicinfo&imagesize=400&audioformat=mp32`
      );
      const data = await response.json();

      return data.results.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artist_name,
        album: track.album_name || 'Single',
        cover: track.album_image || track.image || this.getPlaceholderImage(),
        audio: track.audio || track.audiodownload,
        duration: this.formatDuration(track.duration),
        genre: track.musicinfo?.tags?.genres?.[0] || 'Electronic',
        downloadUrl: track.audiodownload,
        lyrics: this.generateSampleLyrics(track.name)
      }));
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }

  // Get tracks by genre
  async getTracksByGenre(genre, limit = 20) {
    try {
      const response = await fetch(
        `${this.baseURL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&tags=${genre}&include=musicinfo&imagesize=400&audioformat=mp32`
      );
      const data = await response.json();

      return data.results.map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artist_name,
        album: track.album_name || 'Single',
        cover: track.album_image || track.image || this.getPlaceholderImage(),
        audio: track.audio || track.audiodownload,
        duration: this.formatDuration(track.duration),
        genre: genre,
        downloadUrl: track.audiodownload,
        lyrics: this.generateSampleLyrics(track.name)
      }));
    } catch (error) {
      console.error('Error fetching tracks by genre:', error);
      return [];
    }
  }

  // Format duration from seconds to MM:SS
  formatDuration(seconds) {
    if (!seconds) return '3:45';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Generate sample lyrics
  generateSampleLyrics(songTitle) {
    return [
      { time: 0, text: "♪ Instrumental Intro ♪" },
      { time: 5, text: `${songTitle} - A musical journey` },
      { time: 10, text: "Feel the rhythm flowing through" },
      { time: 15, text: "Let the music guide your soul" },
      { time: 20, text: "In this moment we're alive" },
      { time: 25, text: "Dancing through the night" },
      { time: 30, text: "Hearts beating as one" },
      { time: 35, text: "♪ Instrumental Break ♪" },
      { time: 40, text: "The melody takes us higher" },
      { time: 45, text: "Beyond the stars we fly" },
      { time: 50, text: "Music is our escape" },
      { time: 55, text: "Forever in this sound" },
      { time: 60, text: "♪ Outro ♪" }
    ];
  }

  // Get placeholder image
  getPlaceholderImage() {
    return `https://ui-avatars.com/api/?name=Music&size=400&background=random&color=fff&bold=true`;
  }

  // Fallback tracks in case API fails
  getFallbackTracks() {
    const genres = ['Electronic', 'Jazz', 'Rock', 'Classical', 'Pop', 'Ambient'];

    return Array.from({ length: 20 }, (_, i) => ({
      id: `fallback-${i + 1}`,
      title: `Amazing Track ${i + 1}`,
      artist: `Artist ${String.fromCharCode(65 + (i % 26))}`,
      album: `Album ${Math.floor(i / 5) + 1}`,
      cover: `https://picsum.photos/seed/${i}/400/400`,
      audio: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 16) + 1}.mp3`,
      duration: `${Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      genre: genres[i % genres.length],
      downloadUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 16) + 1}.mp3`,
      lyrics: this.generateSampleLyrics(`Amazing Track ${i + 1}`)
    }));
  }

  // Download track
  async downloadTrack(track) {
    try {
      const url = track.downloadUrl || track.audio;
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${track.artist} - ${track.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
      return true;
    } catch (error) {
      console.error('Error downloading track:', error);
      return false;
    }
  }
}

const musicAPIService = new MusicAPIService();
export default musicAPIService;
