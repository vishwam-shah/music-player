import { NextRequest, NextResponse } from 'next/server';
import { Song } from '@saavn-labs/sdk';

export async function GET(request: NextRequest) {
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

    // Search for songs using @saavn-labs/sdk
    const results = await Song.search({
      query: query,
      limit: limit,
      offset: 0,
    });

    if (!results || !results.results || results.results.length === 0) {
      return NextResponse.json({
        success: true,
        items: [],
      });
    }

    // Transform results to match our format
    const items = results.results.map((song: any) => ({
      id: song.id,
      title: song.title || song.name,
      artist: song.artists?.primary?.map((a: any) => a.name).join(', ') || 
              song.artists?.all?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
      duration: song.duration || 0,
      thumbnail: song.images?.find((img: any) => img.quality === '500x500')?.url || 
                 song.images?.[0]?.url || '',
      source: 'jiosaavn',
      album: song.album?.title || song.album || '',
      year: song.year || (song.meta?.releaseDate ? new Date(song.meta.releaseDate).getFullYear() : ''),
      language: song.language || '',
      url: song.url || '',
    }));

    return NextResponse.json({
      success: true,
      items,
      total: results.total || items.length,
    });
  } catch (error) {
    console.error('[JioSaavn] Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search JioSaavn', details: (error as Error).message },
      { status: 500 }
    );
  }
}
