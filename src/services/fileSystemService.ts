// File System Service - Local file scanning and metadata extraction
import * as musicMetadata from 'music-metadata-browser';
import storageService from './storageService';
import type { Song } from '../types';

interface FileSystemDirectoryHandle {
  values(): AsyncIterableIterator<FileSystemHandle>;
}

interface FileSystemHandle {
  kind: 'file' | 'directory';
  name: string;
  getFile?: () => Promise<File>;
}

class FileSystemService {
  private supportedFormats: string[] = ['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac', '.wma'];

  isSupported(): boolean {
    return 'showDirectoryPicker' in window;
  }

  async scanFolder(): Promise<Song[]> {
    if (!this.isSupported()) {
      return this.scanViaFileInput();
    }

    try {
      const dirHandle = await (window as unknown as { showDirectoryPicker: (options?: { mode: string }) => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker({
        mode: 'read'
      });

      const files = await this.readDirectory(dirHandle);
      const songs = await this.processFiles(files);

      for (const song of songs) {
        await storageService.addToLibrary(song);
      }

      return songs;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return [];
      }
      throw error;
    }
  }

  private scanViaFileInput(): Promise<Song[]> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = this.supportedFormats.join(',');
      (input as unknown as { webkitdirectory: boolean }).webkitdirectory = true;

      input.onchange = async (e: Event) => {
        try {
          const target = e.target as HTMLInputElement;
          const files = Array.from(target.files || []);
          const audioFiles = files.filter(file =>
            this.supportedFormats.some(ext =>
              file.name.toLowerCase().endsWith(ext)
            )
          );

          const songs = await this.processFiles(audioFiles);

          for (const song of songs) {
            await storageService.addToLibrary(song);
          }

          resolve(songs);
        } catch (error) {
          reject(error);
        }
      };

      input.oncancel = () => resolve([]);
      input.click();
    });
  }

  private async readDirectory(dirHandle: FileSystemDirectoryHandle, path: string = ''): Promise<File[]> {
    const files: File[] = [];

    for await (const entry of dirHandle.values()) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;

      if (entry.kind === 'file') {
        const isAudio = this.supportedFormats.some(ext =>
          entry.name.toLowerCase().endsWith(ext)
        );

        if (isAudio && entry.getFile) {
          try {
            const file = await entry.getFile();
            files.push(file);
          } catch (error) {
            console.warn(`Could not read file: ${entryPath}`, error);
          }
        }
      } else if (entry.kind === 'directory') {
        const subFiles = await this.readDirectory(entry as unknown as FileSystemDirectoryHandle, entryPath);
        files.push(...subFiles);
      }
    }

    return files;
  }

  private async processFiles(files: File[]): Promise<Song[]> {
    const songs: Song[] = [];

    for (const file of files) {
      try {
        const song = await this.extractMetadata(file);
        songs.push(song);
      } catch (error) {
        console.warn(`Could not process file: ${file.name}`, error);
        songs.push({
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: this.cleanFileName(file.name),
          artist: 'Unknown Artist',
          album: 'Unknown Album',
          duration: 0,
          audio: URL.createObjectURL(file),
          cover: undefined,
          isLocal: true,
          fileName: file.name,
          fileSize: file.size
        });
      }
    }

    return songs;
  }

  private async extractMetadata(file: File): Promise<Song> {
    const metadata = await musicMetadata.parseBlob(file);

    let cover: string | undefined;
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0];
      // Convert Buffer to Uint8Array for Blob compatibility
      const uint8Array = new Uint8Array(picture.data);
      const blob = new Blob([uint8Array], { type: picture.format });
      cover = URL.createObjectURL(blob);
    }

    return {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: metadata.common.title || this.cleanFileName(file.name),
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      year: metadata.common.year,
      genre: metadata.common.genre?.[0],
      track: metadata.common.track?.no ?? undefined,
      duration: metadata.format.duration || 0,
      bitrate: metadata.format.bitrate,
      sampleRate: metadata.format.sampleRate,
      audio: URL.createObjectURL(file),
      cover,
      isLocal: true,
      fileName: file.name,
      fileSize: file.size
    };
  }

  private cleanFileName(fileName: string): string {
    return fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async pickFile(): Promise<Song | null> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = this.supportedFormats.join(',');

      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        try {
          const song = await this.extractMetadata(file);
          resolve(song);
        } catch (error) {
          reject(error);
        }
      };

      input.oncancel = () => resolve(null);
      input.click();
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

const fileSystemService = new FileSystemService();
export default fileSystemService;
