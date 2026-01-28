import { NextRequest, NextResponse } from 'next/server';
import { Song } from '@saavn-labs/sdk';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get('id');

    if (!songId) {
      return NextResponse.json(
        { error: 'Song ID is required' },
        { status: 400 }
      );
    }

    // Get song details including streaming URL using @saavn-labs/sdk
    const result = await Song.getById({ songIds: songId });
    
    if (!result?.songs || result.songs.length === 0) {
      return NextResponse.json(
        { error: 'Song not found or no streaming URL available' },
        { status: 404 }
      );
    }

    const songDetails = result.songs[0];

    // Get encrypted URL from media
    const encryptedUrl = songDetails.media?.encryptedUrl;
    const previewUrl = songDetails.media?.previewUrl;
    
    if (!encryptedUrl) {
      return NextResponse.json(
        { error: 'No encrypted URL found' },
        { status: 404 }
      );
    }

    // Try edge runtime first, fallback to node
    let streamUrls: any[] = [];
    try {
      streamUrls = await Song.experimental.fetchStreamUrls(encryptedUrl, 'edge', true);
    } catch (edgeError) {
      try {
        streamUrls = await Song.experimental.fetchStreamUrls(encryptedUrl, 'node', true);
      } catch (nodeError) {
        // Both runtimes failed
      }
    }
    
    if (!streamUrls || streamUrls.length === 0) {
      // Fallback to preview URL if available
      if (previewUrl) {
        return NextResponse.json({
          success: true,
          id: songId,
          title: songDetails.title || 'Unknown',
          artist: songDetails.artists?.primary?.map((a: any) => a.name).join(', ') || 
                  songDetails.artists?.all?.map((a: any) => a.name).join(', ') || 'Unknown',
          album: songDetails.album?.title || '',
          duration: songDetails.duration || 0,
          thumbnail: songDetails.images?.find((img: any) => img.quality === '500x500')?.url || 
                     songDetails.images?.[0]?.url || '',
          audioUrl: `/api/jiosaavn/proxy?url=${encodeURIComponent(previewUrl)}`,
          format: 'audio/mp4',
          quality: 'preview',
          year: songDetails.year || (songDetails.meta?.releaseDate ? new Date(songDetails.meta.releaseDate).getFullYear() : ''),
          language: songDetails.language || '',
          copyright: songDetails.meta?.copyright || '',
        });
      }
      
      return NextResponse.json(
        { error: 'No audio URL found - decryption failed and no preview available' },
        { status: 404 }
      );
    }

    // Get the highest quality stream URL
    const audioUrl = 
      streamUrls.find((s: any) => s.bitrate === '320')?.url ||
      streamUrls.find((s: any) => s.bitrate === '160')?.url ||
      streamUrls.find((s: any) => s.bitrate === '96')?.url ||
      streamUrls[0]?.url;

    // Proxy the audio URL through our API to avoid CORS issues
    const proxiedUrl = `/api/jiosaavn/proxy?url=${encodeURIComponent(audioUrl)}`;

    return NextResponse.json({
      success: true,
      id: songId,
      title: songDetails.title || 'Unknown',
      artist: songDetails.artists?.primary?.map((a: any) => a.name).join(', ') || 
              songDetails.artists?.all?.map((a: any) => a.name).join(', ') || 'Unknown',
      album: songDetails.album?.title || '',
      duration: songDetails.duration || 0,
      thumbnail: songDetails.images?.find((img: any) => img.quality === '500x500')?.url || 
                 songDetails.images?.[0]?.url || '',
      audioUrl: proxiedUrl,
      format: 'audio/mp4',
      quality: streamUrls.find((s: any) => s.bitrate === '320') ? '320kbps' : 
               streamUrls.find((s: any) => s.bitrate === '160') ? '160kbps' : '96kbps',
      year: songDetails.year || (songDetails.meta?.releaseDate ? new Date(songDetails.meta.releaseDate).getFullYear() : ''),
      language: songDetails.language || '',
      copyright: songDetails.meta?.copyright || '',
    });
  } catch (error) {
    console.error('[JioSaavn] Stream error:', error);
    return NextResponse.json(
      { error: 'Failed to get song stream', details: (error as Error).message },
      { status: 500 }
    );
  }
}
