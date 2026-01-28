// Deezer API Service using RapidAPI

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '4928fe67fcmsh4b051524d806b71p1b6d88jsn4537a59f034f';
const RAPIDAPI_HOST = 'deezerdevs-deezer.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

/**
 * Makes a request to the Deezer API via RapidAPI
 * @param {string} endpoint - The API endpoint to call
 * @returns {Promise<any>} - The response data
 */
const fetchDeezerApi = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Deezer API Error:', error);
    throw error;
  }
};

/**
 * Search for tracks on Deezer
 * @param {string} query - Search query (e.g., "hindi songs", "arijit singh", etc.)
 * @param {number} limit - Maximum number of results (default: 25)
 * @returns {Promise<Object>} - Search results with tracks
 */
export const searchTracks = async (query, limit = 25) => {
  try {
    const data = await fetchDeezerApi(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);

    // Transform Deezer data to match our app's song format
    if (data && data.data) {
      return {
        success: true,
        tracks: data.data.map((track) => ({
          id: track.id,
          title: track.title,
          artist: track.artist?.name || 'Unknown Artist',
          artistId: track.artist?.id,
          album: track.album?.title || 'Unknown Album',
          albumId: track.album?.id,
          cover: track.album?.cover_xl || track.album?.cover_big || track.album?.cover_medium || track.album?.cover,
          audio: track.preview, // 30-second preview
          duration: track.duration,
          link: track.link,
        })),
        total: data.total || 0,
      };
    }

    return { success: false, tracks: [], total: 0 };
  } catch (error) {
    console.error('Error searching tracks:', error);
    return { success: false, tracks: [], error: error.message };
  }
};

/**
 * Search for Hindi songs specifically
 * @param {number} limit - Maximum number of results (default: 25)
 * @returns {Promise<Object>} - Search results with Hindi tracks
 */
export const searchHindiSongs = async (limit = 25) => {
  return searchTracks('hindi bollywood', limit);
};

/**
 * Search for songs by artist
 * @param {string} artistName - Artist name
 * @param {number} limit - Maximum number of results (default: 25)
 * @returns {Promise<Object>} - Search results with artist's tracks
 */
export const searchByArtist = async (artistName, limit = 25) => {
  return searchTracks(`artist:"${artistName}"`, limit);
};

/**
 * Get top charts from Deezer
 * @returns {Promise<Object>} - Chart data with tracks, albums, artists, playlists
 */
export const getCharts = async () => {
  try {
    const data = await fetchDeezerApi('/chart');

    if (data) {
      return {
        success: true,
        tracks: data.tracks?.data?.map((track) => ({
          id: track.id,
          title: track.title,
          artist: track.artist?.name || 'Unknown Artist',
          artistId: track.artist?.id,
          album: track.album?.title || 'Unknown Album',
          albumId: track.album?.id,
          cover: track.album?.cover_xl || track.album?.cover_big || track.album?.cover_medium || track.album?.cover,
          audio: track.preview,
          duration: track.duration,
          link: track.link,
          position: track.position,
        })) || [],
        albums: data.albums?.data || [],
        artists: data.artists?.data || [],
        playlists: data.playlists?.data || [],
      };
    }

    return { success: false, tracks: [] };
  } catch (error) {
    console.error('Error fetching charts:', error);
    return { success: false, tracks: [], error: error.message };
  }
};

/**
 * Get all available genres
 * @returns {Promise<Object>} - List of genres
 */
export const getGenres = async () => {
  try {
    const data = await fetchDeezerApi('/genre');

    if (data && data.data) {
      return {
        success: true,
        genres: data.data,
      };
    }

    return { success: false, genres: [] };
  } catch (error) {
    console.error('Error fetching genres:', error);
    return { success: false, genres: [], error: error.message };
  }
};

/**
 * Get artist information
 * @param {number} artistId - Artist ID
 * @returns {Promise<Object>} - Artist information
 */
export const getArtist = async (artistId) => {
  try {
    const data = await fetchDeezerApi(`/artist/${artistId}`);
    return { success: true, artist: data };
  } catch (error) {
    console.error('Error fetching artist:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get artist's top tracks
 * @param {number} artistId - Artist ID
 * @param {number} limit - Maximum number of results (default: 10)
 * @returns {Promise<Object>} - Artist's top tracks
 */
export const getArtistTopTracks = async (artistId, limit = 10) => {
  try {
    const data = await fetchDeezerApi(`/artist/${artistId}/top?limit=${limit}`);

    if (data && data.data) {
      return {
        success: true,
        tracks: data.data.map((track) => ({
          id: track.id,
          title: track.title,
          artist: track.artist?.name || 'Unknown Artist',
          artistId: track.artist?.id,
          album: track.album?.title || 'Unknown Album',
          albumId: track.album?.id,
          cover: track.album?.cover_xl || track.album?.cover_big || track.album?.cover_medium || track.album?.cover,
          audio: track.preview,
          duration: track.duration,
          link: track.link,
        })),
      };
    }

    return { success: false, tracks: [] };
  } catch (error) {
    console.error('Error fetching artist top tracks:', error);
    return { success: false, tracks: [], error: error.message };
  }
};

/**
 * Get album information
 * @param {number} albumId - Album ID
 * @returns {Promise<Object>} - Album information with tracks
 */
export const getAlbum = async (albumId) => {
  try {
    const data = await fetchDeezerApi(`/album/${albumId}`);

    if (data) {
      return {
        success: true,
        album: {
          id: data.id,
          title: data.title,
          artist: data.artist?.name || 'Unknown Artist',
          artistId: data.artist?.id,
          cover: data.cover_xl || data.cover_big || data.cover_medium || data.cover,
          releaseDate: data.release_date,
          tracks: data.tracks?.data?.map((track) => ({
            id: track.id,
            title: track.title,
            artist: data.artist?.name || 'Unknown Artist',
            artistId: data.artist?.id,
            album: data.title,
            albumId: data.id,
            cover: data.cover_xl || data.cover_big || data.cover_medium || data.cover,
            audio: track.preview,
            duration: track.duration,
            link: track.link,
          })) || [],
        },
      };
    }

    return { success: false, album: null };
  } catch (error) {
    console.error('Error fetching album:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get track information
 * @param {number} trackId - Track ID
 * @returns {Promise<Object>} - Track information
 */
export const getTrack = async (trackId) => {
  try {
    const data = await fetchDeezerApi(`/track/${trackId}`);

    if (data) {
      return {
        success: true,
        track: {
          id: data.id,
          title: data.title,
          artist: data.artist?.name || 'Unknown Artist',
          artistId: data.artist?.id,
          album: data.album?.title || 'Unknown Album',
          albumId: data.album?.id,
          cover: data.album?.cover_xl || data.album?.cover_big || data.album?.cover_medium || data.album?.cover,
          audio: data.preview,
          duration: data.duration,
          link: data.link,
          releaseDate: data.release_date,
          bpm: data.bpm,
          gain: data.gain,
        },
      };
    }

    return { success: false, track: null };
  } catch (error) {
    console.error('Error fetching track:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get playlist information
 * @param {number} playlistId - Playlist ID
 * @returns {Promise<Object>} - Playlist information with tracks
 */
export const getPlaylist = async (playlistId) => {
  try {
    const data = await fetchDeezerApi(`/playlist/${playlistId}`);

    if (data) {
      return {
        success: true,
        playlist: {
          id: data.id,
          title: data.title,
          description: data.description,
          cover: data.picture_xl || data.picture_big || data.picture_medium || data.picture,
          creator: data.creator?.name,
          tracks: data.tracks?.data?.map((track) => ({
            id: track.id,
            title: track.title,
            artist: track.artist?.name || 'Unknown Artist',
            artistId: track.artist?.id,
            album: track.album?.title || 'Unknown Album',
            albumId: track.album?.id,
            cover: track.album?.cover_xl || track.album?.cover_big || track.album?.cover_medium || track.album?.cover,
            audio: track.preview,
            duration: track.duration,
            link: track.link,
          })) || [],
        },
      };
    }

    return { success: false, playlist: null };
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get radio tracks by genre
 * @param {number} genreId - Genre ID
 * @returns {Promise<Object>} - Radio tracks for the genre
 */
export const getRadioByGenre = async (genreId) => {
  try {
    const data = await fetchDeezerApi(`/radio/${genreId}/tracks`);

    if (data && data.data) {
      return {
        success: true,
        tracks: data.data.map((track) => ({
          id: track.id,
          title: track.title,
          artist: track.artist?.name || 'Unknown Artist',
          artistId: track.artist?.id,
          album: track.album?.title || 'Unknown Album',
          albumId: track.album?.id,
          cover: track.album?.cover_xl || track.album?.cover_big || track.album?.cover_medium || track.album?.cover,
          audio: track.preview,
          duration: track.duration,
          link: track.link,
        })),
      };
    }

    return { success: false, tracks: [] };
  } catch (error) {
    console.error('Error fetching radio tracks:', error);
    return { success: false, tracks: [], error: error.message };
  }
};

export default {
  searchTracks,
  searchHindiSongs,
  searchByArtist,
  getCharts,
  getGenres,
  getArtist,
  getArtistTopTracks,
  getAlbum,
  getTrack,
  getPlaylist,
  getRadioByGenre,
};
