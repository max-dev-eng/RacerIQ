import { SUPPORTED_VIDEO_FORMATS, type VideoFormat } from "RacerIQ/src/shared/schema";

export function getVideoFormat(filename: string): VideoFormat | null {
  const extension = filename.split('.').pop()?.toLowerCase();
  if (extension && SUPPORTED_VIDEO_FORMATS.includes(extension as VideoFormat)) {
    return extension as VideoFormat;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  // Check file size (500MB limit)
  const maxSize = 500 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 500MB limit' };
  }

  // Check file format
  const format = getVideoFormat(file.name);
  if (!format) {
    return { 
      valid: false, 
      error: `Unsupported format. Supported formats: ${SUPPORTED_VIDEO_FORMATS.join(', ')}` 
    };
  }

  return { valid: true };
}

export function createVideoThumbnail(videoFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      video.currentTime = Math.min(5, video.duration / 2); // Seek to 5 seconds or middle
    });

    video.addEventListener('seeked', () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
      } else {
        reject(new Error('Could not create canvas context'));
      }
    });

    video.addEventListener('error', () => {
      reject(new Error('Could not load video for thumbnail'));
    });

    video.src = URL.createObjectURL(videoFile);
  });
}
