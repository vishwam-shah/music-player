// Deezer API Service using RapidAPI

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '4928fe67fcmsh4b051524d806b71p1b6d88jsn4537a59f034f';
const RAPIDAPI_HOST = 'deezerdevs-deezer.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

export interface DeezerTrack {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album: string;
  albumId?: string;
  cover?: string;
  audio: string;
  duration: number;
  link?: string;
}

const fetchDeezerApi = async (endpoint: string): Promise<any> => {
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

export const searchTracks = async (query: string, limit = 25): Promise<{ success: boolean; tracks: DeezerTrack[]; total: number }> => {
  try {
    const data = await fetchDeezerApi(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (data && data.data) {
      return {
        success: true,
        tracks: data.data.map((track: any) => ({
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
        total: data.total || 0,
      };
    }
    return { success: false, tracks: [], total: 0 };
  } catch (error) {
    return { success: false, tracks: [], total: 0 };
  }
};


export const getCharts = async (): Promise<{ success: boolean; tracks: DeezerTrack[]; error?: string }> => {
  try {
    const data = await fetchDeezerApi('/chart');
    if (data && data.tracks && data.tracks.data) {
      return {
        success: true,
        tracks: data.tracks.data.map((track: any) => ({
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
    return { success: false, tracks: [], error: 'No chart data found' };
  } catch (error: any) {
    return { success: false, tracks: [], error: error?.message || 'Failed to fetch charts' };
  }
};
