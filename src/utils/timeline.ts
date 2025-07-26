/**
 * @fileoverview Timeline utility functions
 * @description Utilities for timeline calculations, time conversions, and incident positioning
 */

import { TIMELINE_CONFIG } from '@/types/constants';
import type { TimelineIncident, TimeRange } from '@/types';

/**
 * Time conversion utilities
 */
export const msToSeconds = (ms: number): number => ms / 1000;
export const secondsToMs = (seconds: number): number => seconds * 1000;
export const minutesToMs = (minutes: number): number => minutes * 60 * 1000;
export const hoursToMs = (hours: number): number => hours * 60 * 60 * 1000;
export const daysToMs = (days: number): number => days * 24 * 60 * 60 * 1000;

/**
 * Timeline calculation utilities
 */
export const calculateTimelineWidth = (
  duration: number,
  pixelsPerSecond: number
): number => {
  return duration * pixelsPerSecond;
};

export const calculatePixelsPerSecond = (
  containerWidth: number,
  duration: number,
  zoom = 1
): number => {
  return (containerWidth / duration) * zoom;
};

export const timeToPixels = (
  time: number,
  startTime: number,
  pixelsPerSecond: number
): number => {
  return (time - startTime) * pixelsPerSecond;
};

export const pixelsToTime = (
  pixels: number,
  startTime: number,
  pixelsPerSecond: number
): number => {
  return startTime + (pixels / pixelsPerSecond);
};

/**
 * Time range utilities
 */
export const createTimeRange = (start: number, end: number): TimeRange => ({
  start: Math.min(start, end),
  end: Math.max(start, end),
});

export const isTimeInRange = (time: number, range: TimeRange): boolean => {
  return time >= range.start && time <= range.end;
};

export const getTimeRangeDuration = (range: TimeRange): number => {
  return range.end - range.start;
};

export const expandTimeRange = (range: TimeRange, factor: number): TimeRange => {
  const center = (range.start + range.end) / 2;
  const halfDuration = getTimeRangeDuration(range) / 2;
  const newHalfDuration = halfDuration * factor;
  
  return {
    start: center - newHalfDuration,
    end: center + newHalfDuration,
  };
};

export const clampTimeRange = (range: TimeRange, bounds: TimeRange): TimeRange => {
  return {
    start: Math.max(range.start, bounds.start),
    end: Math.min(range.end, bounds.end),
  };
};

/**
 * Incident positioning utilities
 */
export const calculateIncidentPosition = (
  incident: TimelineIncident,
  timelineStart: number,
  pixelsPerSecond: number
): { x: number; width: number } => {
  const startX = timeToPixels(incident.timestamp, timelineStart, pixelsPerSecond);
  const endX = incident.endTime 
    ? timeToPixels(incident.endTime, timelineStart, pixelsPerSecond)
    : startX + 4; // Default width for point incidents
    
  return {
    x: startX,
    width: Math.max(endX - startX, 4), // Minimum width of 4px
  };
};

export const getIncidentsInRange = (
  incidents: TimelineIncident[],
  range: TimeRange
): TimelineIncident[] => {
  return incidents.filter(incident => {
    const incidentEnd = incident.endTime || incident.timestamp;
    return !(incidentEnd < range.start || incident.timestamp > range.end);
  });
};

/**
 * Timeline marker utilities
 */
export const calculateTimeMarkers = (
  range: TimeRange,
  pixelsPerSecond: number,
  minSpacing = 100 // Minimum pixels between markers
): Array<{ time: number; label: string; type: 'major' | 'minor' }> => {
  const duration = getTimeRangeDuration(range);
  const markers: Array<{ time: number; label: string; type: 'major' | 'minor' }> = [];
  
  // Calculate appropriate interval
  const targetIntervals = Math.floor(duration * pixelsPerSecond / minSpacing);
  const intervals = [1, 5, 10, 30, 60, 300, 600, 1800, 3600]; // seconds
  const interval = intervals.find(i => duration / i <= targetIntervals) || intervals[intervals.length - 1];
  
  // Generate markers
  const startMarker = Math.ceil(range.start / interval) * interval;
  for (let time = startMarker; time <= range.end; time += interval) {
    const isMajor = time % (interval * 5) === 0;
    markers.push({
      time,
      label: formatTimelineTime(time),
      type: isMajor ? 'major' : 'minor',
    });
  }
  
  return markers;
};

export const formatTimelineTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Zoom utilities
 */
export const getNextZoomLevel = (currentZoom: number, direction: 'in' | 'out'): number => {
  const levels = TIMELINE_CONFIG.ZOOM_LEVELS;
  const currentIndex = levels.findIndex(level => level >= currentZoom);
  
  if (direction === 'in') {
    return levels[Math.min(currentIndex + 1, levels.length - 1)] || currentZoom;
  } else {
    return levels[Math.max(currentIndex - 1, 0)] || currentZoom;
  }
};

export const clampZoom = (zoom: number): number => {
  const min = TIMELINE_CONFIG.ZOOM_LEVELS[0];
  const max = TIMELINE_CONFIG.ZOOM_LEVELS[TIMELINE_CONFIG.ZOOM_LEVELS.length - 1];
  return Math.max(min, Math.min(max, zoom));
};

/**
 * Timeline navigation utilities
 */
export const centerTimeInView = (
  targetTime: number,
  viewWidth: number,
  pixelsPerSecond: number
): TimeRange => {
  const halfDuration = (viewWidth / pixelsPerSecond) / 2;
  return {
    start: targetTime - halfDuration,
    end: targetTime + halfDuration,
  };
};

export const scrollTimelineToTime = (
  targetTime: number,
  currentRange: TimeRange,
  viewWidth: number,
  pixelsPerSecond: number
): TimeRange => {
  const viewDuration = viewWidth / pixelsPerSecond;
  
  if (isTimeInRange(targetTime, currentRange)) {
    return currentRange; // Already in view
  }
  
  // Center the target time
  return {
    start: targetTime - viewDuration / 2,
    end: targetTime + viewDuration / 2,
  };
};

/**
 * Timeline interaction utilities
 */
export const getTimeFromMousePosition = (
  mouseX: number,
  timelineStart: number,
  pixelsPerSecond: number,
  containerOffset = 0
): number => {
  const relativeX = mouseX - containerOffset;
  return pixelsToTime(relativeX, timelineStart, pixelsPerSecond);
};

export const snapToGrid = (
  time: number,
  gridInterval: number,
  threshold = 0.5
): number => {
  const gridTime = Math.round(time / gridInterval) * gridInterval;
  const distance = Math.abs(time - gridTime);
  
  return distance <= threshold ? gridTime : time;
};

/**
 * Timeline rendering utilities
 */
export const shouldRenderIncident = (
  incident: TimelineIncident,
  viewRange: TimeRange,
  minWidth = 2
): boolean => {
  const incidentEnd = incident.endTime || incident.timestamp;
  
  // Check if incident is in view
  if (incidentEnd < viewRange.start || incident.timestamp > viewRange.end) {
    return false;
  }
  
  // Check if incident is wide enough to render
  const pixelsPerSecond = 1; // This would come from context
  const width = (incidentEnd - incident.timestamp) * pixelsPerSecond;
  
  return width >= minWidth;
};

export const optimizeIncidentRendering = (
  incidents: TimelineIncident[],
  viewRange: TimeRange,
  maxIncidents = 1000
): TimelineIncident[] => {
  const visibleIncidents = getIncidentsInRange(incidents, viewRange);
  
  if (visibleIncidents.length <= maxIncidents) {
    return visibleIncidents;
  }
  
  // If too many incidents, sample them
  const step = Math.ceil(visibleIncidents.length / maxIncidents);
  return visibleIncidents.filter((_, index) => index % step === 0);
};

/**
 * Timeline export utilities
 */
export const exportTimelineData = (
  incidents: TimelineIncident[],
  range: TimeRange,
  format: 'csv' | 'json' = 'json'
): string => {
  const filteredIncidents = getIncidentsInRange(incidents, range);
  
  if (format === 'csv') {
    const headers = ['Timestamp', 'Type', 'Severity', 'Description', 'Camera ID'];
    const rows = filteredIncidents.map(incident => [
      new Date(incident.timestamp).toISOString(),
      incident.type,
      incident.severity,
      incident.description || '',
      incident.cameraId || '',
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  
  return JSON.stringify(filteredIncidents, null, 2);
};
