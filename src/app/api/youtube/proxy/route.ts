import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const audioUrl = searchParams.get('url');

    if (!audioUrl || audioUrl === '[object Object]') {
      return NextResponse.json(
        { error: 'Valid audio URL is required' },
        { status: 400 }
      );
    }

    // Decode URL if it's encoded
    const decodedUrl = decodeURIComponent(audioUrl);

    console.log('[Proxy] Fetching audio from:', decodedUrl);

    // Fetch the audio stream
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Range': request.headers.get('Range') || 'bytes=0-',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch audio' },
        { status: response.status }
      );
    }

    // Get the content type and other headers
    const contentType = response.headers.get('Content-Type') || 'audio/mp4';
    const contentLength = response.headers.get('Content-Length');
    const contentRange = response.headers.get('Content-Range');

    // Create response headers
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Access-Control-Allow-Origin', '*');

    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }
    if (contentRange) {
      headers.set('Content-Range', contentRange);
    }

    // Stream the response
    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
