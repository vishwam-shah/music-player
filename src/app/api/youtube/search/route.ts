import { NextResponse } from 'next/server';
import YouTube from 'youtube-sr';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Search YouTube using youtube-sr
    const searchResults = await YouTube.search(query, { limit, type: 'video' });

    // Map to our format
    const videos = searchResults.map((video) => ({
      id: video.id || '',
      title: video.title || 'Unknown Title',
      artist: video.channel?.name || 'Unknown Artist',
      duration: video.durationFormatted || '0:00',
      durationSeconds: video.duration ? Math.floor(video.duration / 1000) : 0,
      thumbnail: video.thumbnail?.url || '',
      views: video.views || 0,
      uploadedAt: video.uploadedAt || '',
      url: video.url || '',
    }));

    return NextResponse.json({
      success: true,
      query,
      results: videos,
      total: videos.length,
    });
  } catch (error) {
    console.error('YouTube search error:', error);
    return NextResponse.json(
      { error: 'Failed to search YouTube', details: (error as Error).message },
      { status: 500 }
    );
  }
}
