import { NextResponse } from 'next/server';
import play from 'play-dl';

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

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // Validate URL
    const validated = play.yt_validate(url);
    if (validated !== 'video') {
      return NextResponse.json(
        { error: 'Invalid YouTube video ID' },
        { status: 400 }
      );
    }

    // Get video info
    const info = await play.video_info(url);

    if (!info) {
      return NextResponse.json(
        { error: 'Could not get video info' },
        { status: 404 }
      );
    }

    // Get audio formats from the video info
    const formats = info.format;

    if (!formats || formats.length === 0) {
      return NextResponse.json(
        { error: 'No formats available' },
        { status: 404 }
      );
    }


    // Strictly select supported audio formats
    const supportedMimeTypes = ['audio/mp4', 'audio/webm', 'audio/mpeg'];
    let audioFormats = formats.filter(f =>
      f.mimeType && supportedMimeTypes.some(type => f.mimeType?.startsWith(type)) && f.url
    );

    // Fallback: try any format with 'audio' in mimeType
    if (audioFormats.length === 0) {
      audioFormats = formats.filter(f => f.mimeType?.includes('audio') && f.url);
    }

    // Final fallback: try any format with a url and bitrate
    if (audioFormats.length === 0) {
      audioFormats = formats.filter(f => f.url && f.bitrate);
    }

    if (audioFormats.length === 0) {
      return NextResponse.json(
        { error: 'No supported audio format available' },
        { status: 404 }
      );
    }

    // Sort by bitrate (highest first)
    audioFormats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

    const bestAudio = audioFormats[0];

    if (!bestAudio?.url) {
      return NextResponse.json(
        { error: 'No audio URL available' },
        { status: 404 }
      );
    }

    const videoDetails = info.video_details;

    return NextResponse.json({
      success: true,
      id: videoId,
      title: videoDetails.title || 'Unknown',
      artist: videoDetails.channel?.name || 'Unknown',
      duration: videoDetails.durationInSec || 0,
      thumbnail: videoDetails.thumbnails?.[videoDetails.thumbnails.length - 1]?.url || '',
      audioUrl: bestAudio.url,
      format: bestAudio.mimeType?.split(';')[0] || 'audio/mp4',
      quality: `${Math.round((bestAudio.bitrate || 0) / 1000)}kbps`,
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
