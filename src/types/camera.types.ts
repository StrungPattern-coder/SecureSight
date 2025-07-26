/**
 * @fileoverview Camera-related type definitions
 * @description Types for camera entities, status, and operations
 */

/**
 * Camera status enumeration
 */
export enum CameraStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  ERROR = 'error'
}

/**
 * Camera entity interface
 */
export interface Camera {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Physical location */
  location: string;
  /** Current operational status */
  status: CameraStatus;
  /** Optional description */
  description?: string;
  /** Last heartbeat timestamp */
  lastSeen?: Date;
  /** Stream URL */
  streamUrl?: string;
  /** Thumbnail URL */
  thumbnailUrl?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Camera creation payload
 */
export interface CreateCameraRequest {
  name: string;
  location: string;
  description?: string;
  streamUrl?: string;
}

/**
 * Camera update payload
 */
export interface UpdateCameraRequest {
  name?: string;
  location?: string;
  status?: CameraStatus;
  description?: string;
  streamUrl?: string;
}

/**
 * Camera filter options
 */
export interface CameraFilters {
  status?: CameraStatus[];
  location?: string;
  searchTerm?: string;
}

/**
 * Camera selection state
 */
export interface CameraSelection {
  selectedCameraId: string | null;
  selectedCameras: string[];
}
