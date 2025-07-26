/**
 * @fileoverview Timeline-related type definitions
 * @description Types for timeline functionality, video sync, and playback controls
 */

/**
 * Timeline position interface
 */
export interface TimelinePosition {
  /** Current time in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Progress as percentage (0-100) */
  progress: number;
}

/**
 * Timeline marker interface
 */
export interface TimelineMarker {
  /** Unique identifier */
  id: string;
  /** Time position in seconds */
  time: number;
  /** Marker type */
  type: 'incident' | 'event' | 'bookmark';
  /** Display label */
  label: string;
  /** Marker color */
  color?: string;
  /** Optional description */
  description?: string;
}

/**
 * Timeline incident marker (extended from TimelineMarker)
 */
export interface TimelineIncident extends TimelineMarker {
  /** Incident timestamp */
  timestamp: number;
  /** Optional end time for duration incidents */
  endTime?: number;
  /** Incident severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Associated camera ID */
  cameraId?: string;
  /** Incident status */
  status?: 'active' | 'resolved' | 'investigating';
}

/**
 * Timeline segment interface
 */
export interface TimelineSegment {
  /** Segment start time */
  start: number;
  /** Segment end time */
  end: number;
  /** Segment type */
  type: 'normal' | 'incident' | 'alert' | 'motion';
  /** Segment color */
  color?: string;
  /** Segment metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Playback speed options
 */
export enum PlaybackSpeed {
  QUARTER = 0.25,
  HALF = 0.5,
  NORMAL = 1.0,
  DOUBLE = 2.0,
  QUAD = 4.0
}

/**
 * Timeline view configuration
 */
export interface TimelineViewConfig {
  /** Zoom level (1x, 2x, 4x, etc.) */
  zoomLevel: number;
  /** Visible time range in seconds */
  visibleRange: {
    start: number;
    end: number;
  };
  /** Show grid lines */
  showGrid: boolean;
  /** Show time labels */
  showTimeLabels: boolean;
  /** Show markers */
  showMarkers: boolean;
  /** Marker size */
  markerSize: 'small' | 'medium' | 'large';
}

/**
 * Timeline interaction events
 */
export interface TimelineInteraction {
  /** Event type */
  type: 'click' | 'drag' | 'scroll' | 'hover';
  /** Time position */
  time: number;
  /** Mouse coordinates */
  coordinates?: { x: number; y: number };
  /** Additional event data */
  data?: unknown;
}

/**
 * Video synchronization state
 */
export interface VideoSyncState {
  /** Whether video and timeline are synced */
  isSynced: boolean;
  /** Sync offset in seconds */
  offset: number;
  /** Last sync timestamp */
  lastSync: Date;
  /** Sync accuracy in ms */
  accuracy: number;
}

/**
 * Timeline control actions
 */
export interface TimelineControls {
  /** Play/pause */
  togglePlayback: () => void;
  /** Seek to time */
  seekTo: (time: number) => void;
  /** Step forward */
  stepForward: (seconds?: number) => void;
  /** Step backward */
  stepBackward: (seconds?: number) => void;
  /** Jump to next marker */
  nextMarker: () => void;
  /** Jump to previous marker */
  previousMarker: () => void;
  /** Set playback speed */
  setSpeed: (speed: PlaybackSpeed) => void;
  /** Toggle loop */
  toggleLoop: () => void;
  /** Reset to beginning */
  reset: () => void;
}

/**
 * Timeline data source
 */
export interface TimelineDataSource {
  /** Video URL */
  videoUrl: string;
  /** Timeline markers */
  markers: TimelineMarker[];
  /** Timeline segments */
  segments: TimelineSegment[];
  /** Total duration */
  duration: number;
  /** Start timestamp */
  startTime: Date;
  /** End timestamp */
  endTime: Date;
}
