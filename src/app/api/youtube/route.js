import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

// Directory to store downloaded audio
const DOWNLOADS_DIR = path.join(process.cwd(), 'public', 'downloads');

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|music\.youtube\.com)\/.+$/;
    if (!youtubeRegex.test(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Get video info first
    const infoCommand = `yt-dlp --dump-json --no-download "${url}"`;

    let videoInfo;
    try {
      const { stdout } = await execAsync(infoCommand, { maxBuffer: 10 * 1024 * 1024 });
      videoInfo = JSON.parse(stdout);
    } catch (error) {
      console.error('yt-dlp info error:', error);

      // Check if yt-dlp is installed
      if (error.message.includes('not recognized') || error.message.includes('not found')) {
        return NextResponse.json(
          {
            error: 'yt-dlp is not installed. Please install it with: pip install yt-dlp',
            details: 'Server-side dependency missing'
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to get video information', details: error.message },
        { status: 500 }
      );
    }

    // Generate unique filename
    const videoId = videoInfo.id || Date.now().toString();
    const safeTitle = videoInfo.title
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 50);
    const filename = `${videoId}_${safeTitle}.mp3`;
    const outputPath = path.join(DOWNLOADS_DIR, filename);
    const publicUrl = `/downloads/${filename}`;

    // Check if already downloaded
    if (fs.existsSync(outputPath)) {
      return NextResponse.json({
        success: true,
        title: videoInfo.title,
        artist: videoInfo.artist || videoInfo.uploader || videoInfo.channel,
        channel: videoInfo.channel || videoInfo.uploader,
        duration: videoInfo.duration,
        thumbnail: videoInfo.thumbnail,
        audioUrl: publicUrl,
        cached: true
      });
    }

    // Download audio only
    const downloadCommand = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${url}"`;

    try {
      await execAsync(downloadCommand, { maxBuffer: 10 * 1024 * 1024 });
    } catch (error) {
      console.error('yt-dlp download error:', error);

      // Check if ffmpeg is installed
      if (error.message.includes('ffmpeg') || error.message.includes('ffprobe')) {
        return NextResponse.json(
          {
            error: 'ffmpeg is not installed. Please install it for audio extraction.',
            details: 'Server-side dependency missing'
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to download audio', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      title: videoInfo.title,
      artist: videoInfo.artist || videoInfo.uploader || videoInfo.channel,
      channel: videoInfo.channel || videoInfo.uploader,
      duration: videoInfo.duration,
      thumbnail: videoInfo.thumbnail,
      audioUrl: publicUrl,
      cached: false
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Clean up old downloads (optional - run on GET request)
export async function GET() {
  try {
    const files = fs.readdirSync(DOWNLOADS_DIR);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    let cleaned = 0;

    for (const file of files) {
      const filePath = path.join(DOWNLOADS_DIR, file);
      const stats = fs.statSync(filePath);

      if (now - stats.mtimeMs > maxAge) {
        fs.unlinkSync(filePath);
        cleaned++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned ${cleaned} old files`,
      remaining: files.length - cleaned
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to clean downloads', details: error.message },
      { status: 500 }
    );
  }
}
