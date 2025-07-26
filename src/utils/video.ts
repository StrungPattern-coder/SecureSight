/**
 * @fileoverview Video and media utility functions
 * @description Utilities for handling video playback, media formats, and player controls
 */

import { VIDEO_CONFIG } from '@/types/constants';

/**
 * Video format and codec utilities
 */
export const getSupportedVideoFormats = (): string[] => {
  const video = document.createElement('video');
  const formats: string[] = [];

  VIDEO_CONFIG.FORMATS.forEach((format) => {
    if (video.canPlayType(`video/${format}`)) {
      formats.push(format);
    }
  });

  return formats;
};

export const canPlayVideo = (src: string): boolean => {
  const video = document.createElement('video');
  const extension = src.split('.').pop()?.toLowerCase();
  
  if (!extension) return false;
  
  const mimeType = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
  }[extension];

  return mimeType ? !!video.canPlayType(mimeType) : false;
};

/**
 * Video time formatting utilities
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

export const parseTimeToSeconds = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
};

/**
 * Video quality utilities
 */
export const getOptimalQuality = (bandwidth: number): string => {
  const qualities = [...VIDEO_CONFIG.QUALITY_OPTIONS].sort((a, b) => b.bitrate - a.bitrate);
  
  for (const quality of qualities) {
    if (bandwidth >= quality.bitrate * 1.2) { // 20% buffer
      return quality.value;
    }
  }
  
  return qualities[qualities.length - 1].value; // Return lowest quality as fallback
};

export const getQualityBitrate = (quality: string): number => {
  const qualityOption = VIDEO_CONFIG.QUALITY_OPTIONS.find(q => q.value === quality);
  return qualityOption?.bitrate || 0;
};

/**
 * Video thumbnail utilities
 */
export const generateVideoThumbnail = (
  videoElement: HTMLVideoElement,
  time = 0
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const handleLoadedData = () => {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      videoElement.currentTime = time;
    };

    const handleSeeked = () => {
      ctx.drawImage(videoElement, 0, 0);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
      resolve(thumbnail);
      
      // Cleanup
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('seeked', handleSeeked);
    };

    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('seeked', handleSeeked);
    
    if (videoElement.readyState >= 2) {
      handleLoadedData();
    }
  });
};

/**
 * Video playback utilities
 */
export const setPlaybackRate = (videoElement: HTMLVideoElement, rate: number): void => {
  const clampedRate = Math.max(0.25, Math.min(4, rate));
  videoElement.playbackRate = clampedRate;
};

export const seekToTime = (videoElement: HTMLVideoElement, time: number): void => {
  const clampedTime = Math.max(0, Math.min(videoElement.duration || 0, time));
  videoElement.currentTime = clampedTime;
};

export const seekToPercentage = (videoElement: HTMLVideoElement, percentage: number): void => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const time = (videoElement.duration || 0) * (clampedPercentage / 100);
  seekToTime(videoElement, time);
};

/**
 * Video buffer utilities
 */
export const getBufferedRanges = (videoElement: HTMLVideoElement): Array<{ start: number; end: number }> => {
  const buffered = videoElement.buffered;
  const ranges: Array<{ start: number; end: number }> = [];
  
  for (let i = 0; i < buffered.length; i++) {
    ranges.push({
      start: buffered.start(i),
      end: buffered.end(i),
    });
  }
  
  return ranges;
};

export const getBufferedPercentage = (videoElement: HTMLVideoElement): number => {
  const buffered = videoElement.buffered;
  const duration = videoElement.duration;
  
  if (!duration || buffered.length === 0) return 0;
  
  let totalBuffered = 0;
  for (let i = 0; i < buffered.length; i++) {
    totalBuffered += buffered.end(i) - buffered.start(i);
  }
  
  return (totalBuffered / duration) * 100;
};

/**
 * Video error handling utilities
 */
export const getVideoErrorMessage = (error: MediaError | null): string => {
  if (!error) return 'Unknown error occurred';
  
  switch (error.code) {
    case MediaError.MEDIA_ERR_ABORTED:
      return 'Video playback was aborted';
    case MediaError.MEDIA_ERR_NETWORK:
      return 'Network error while loading video';
    case MediaError.MEDIA_ERR_DECODE:
      return 'Error decoding video';
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return 'Video format not supported';
    default:
      return 'Unknown video error';
  }
};

/**
 * Video download utilities
 */
export const downloadVideo = (src: string, filename?: string): void => {
  const link = document.createElement('a');
  link.href = src;
  link.download = filename || 'video.mp4';
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Video screenshot utilities
 */
export const captureVideoFrame = (
  videoElement: HTMLVideoElement,
  quality = 0.9
): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Canvas context not available');
  
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  ctx.drawImage(videoElement, 0, 0);
  return canvas.toDataURL('image/jpeg', quality);
};

/**
 * Video aspect ratio utilities
 */
export const calculateAspectRatio = (width: number, height: number): string => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
};

export const getOptimalDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const aspectRatio = originalWidth / originalHeight;
  
  let width = maxWidth;
  let height = maxWidth / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }
  
  return { width: Math.round(width), height: Math.round(height) };
};
