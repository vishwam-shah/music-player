import { NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Initialize YouTube client
    const youtube = await Innertube.create({
      // Cache disabled for fresh stream URLs
      cache: undefined,
    });

    // Get video info
    const info = await youtube.getInfo(videoId);

    if (!info) {
      return NextResponse.json(
        { error: 'Could not get video info' },
        { status: 404 }
      );
    }

    // Choose best audio format
    const format = info.chooseFormat({
      type: 'audio',
      quality: 'best',
    });

    if (!format) {
      return NextResponse.json(
        { error: 'No audio format available' },
        { status: 404 }
      );
    }

    // Get audio URL - handle both direct URLs and ciphered URLs
    let audioUrl: string;
    
    try {
      // Check if URL exists directly
      if (format.url) {
        audioUrl = format.url;
      } else {
        // Try to decipher
        audioUrl = await format.decipher(youtube.session.player);
      }
    } catch (decipherError) {
      console.error('Decipher error:', decipherError);
      // Fallback: try to get URL from format
      audioUrl = format.url || '';
      if (!audioUrl) {
        return NextResponse.json(
          { error: 'Could not extract audio URL' },
          { status: 500 }
        );
      }
    }

    const videoDetails = info.basic_info;

    return NextResponse.json({
      success: true,
      id: videoId,
      title: videoDetails.title || 'Unknown',
      artist: videoDetails.author || 'Unknown',
      duration: videoDetails.duration || 0,
      thumbnail: videoDetails.thumbnail?.[0]?.url || '',
      audioUrl: audioUrl,
      format: format.mime_type?.split(';')[0] || 'audio/mp4',
      quality: format.bitrate ? `${Math.round(format.bitrate / 1000)}kbps` : 'unknown',
    });
  } catch (error) {
    console.error('YouTube stream error:', error);

    const errorMessage = (error as Error).message || 'Unknown error';

    // Handle common errors
    if (errorMessage.includes('age')) {
      return NextResponse.json(
        { error: 'This video is age-restricted' },
        { status: 403 }
      );
    }

    if (errorMessage.includes('unavailable') || errorMessage.includes('private')) {
      return NextResponse.json(
        { error: 'Video is unavailable or private' },
        { status: 404 }
      );
    }

    if (errorMessage.includes('Sign in')) {
      return NextResponse.json(
        { error: 'This video requires sign-in' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get audio stream', details: errorMessage },
      { status: 500 }
    );
  }
}
