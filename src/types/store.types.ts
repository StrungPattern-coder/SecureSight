/**
 * @fileoverview Store-related type definitions
 * @description Types for state management and store interfaces
 */

import { Camera, CameraStatus, CameraFilters } from './camera.types';
import { Incident, IncidentType, IncidentSeverity, IncidentStatus, IncidentFilters } from './incident.types';
import { ThemeMode, LoadingState, Toast } from './ui.types';

/**
 * Camera store state
 */
export interface CameraStoreState {
  /** List of cameras */
  cameras: Camera[];
  /** Currently selected camera */
  selectedCamera: Camera | null;
  /** Camera filters */
  filters: CameraFilters;
  /** Loading state */
  loading: LoadingState;
  /** Last update timestamp */
  lastUpdated: Date | null;
}

/**
 * Camera store actions
 */
export interface CameraStoreActions {
  /** Fetch all cameras */
  fetchCameras: () => Promise<void>;
  /** Select a camera */
  selectCamera: (cameraId: string) => void;
  /** Update camera status */
  updateCameraStatus: (cameraId: string, status: CameraStatus) => void;
  /** Add new camera */
  addCamera: (camera: Omit<Camera, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  /** Update camera */
  updateCamera: (cameraId: string, updates: Partial<Camera>) => Promise<void>;
  /** Delete camera */
  deleteCamera: (cameraId: string) => Promise<void>;
  /** Set filters */
  setFilters: (filters: Partial<CameraFilters>) => void;
  /** Clear filters */
  clearFilters: () => void;
}

/**
 * Incident store state
 */
export interface IncidentStoreState {
  /** List of incidents */
  incidents: Incident[];
  /** Currently selected incident */
  selectedIncident: Incident | null;
  /** Incident filters */
  filters: IncidentFilters;
  /** Loading state */
  loading: LoadingState;
  /** Last update timestamp */
  lastUpdated: Date | null;
  /** Unread incidents count */
  unreadCount: number;
}

/**
 * Incident store actions
 */
export interface IncidentStoreActions {
  /** Fetch all incidents */
  fetchIncidents: () => Promise<void>;
  /** Select an incident */
  selectIncident: (incidentId: string) => void;
  /** Create new incident */
  createIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  /** Update incident */
  updateIncident: (incidentId: string, updates: Partial<Incident>) => Promise<void>;
  /** Resolve incident */
  resolveIncident: (incidentId: string, notes?: string) => Promise<void>;
  /** Delete incident */
  deleteIncident: (incidentId: string) => Promise<void>;
  /** Set filters */
  setFilters: (filters: Partial<IncidentFilters>) => void;
  /** Clear filters */
  clearFilters: () => void;
  /** Mark incidents as read */
  markAsRead: (incidentIds: string[]) => void;
}

/**
 * Timeline store state
 */
export interface TimelineStoreState {
  /** Current timeline position (0-1) */
  currentTime: number;
  /** Timeline duration in seconds */
  duration: number;
  /** Whether timeline is playing */
  isPlaying: boolean;
  /** Playback speed multiplier */
  playbackSpeed: number;
  /** Timeline incidents for current camera */
  timelineIncidents: Incident[];
  /** Visible time range */
  timeRange: {
    start: Date;
    end: Date;
  };
}

/**
 * Timeline store actions
 */
export interface TimelineStoreActions {
  /** Set timeline position */
  setCurrentTime: (time: number) => void;
  /** Set timeline duration */
  setDuration: (duration: number) => void;
  /** Play/pause timeline */
  togglePlayback: () => void;
  /** Set playback speed */
  setPlaybackSpeed: (speed: number) => void;
  /** Jump to specific time */
  jumpToTime: (time: number) => void;
  /** Jump to incident */
  jumpToIncident: (incidentId: string) => void;
  /** Set time range */
  setTimeRange: (start: Date, end: Date) => void;
  /** Sync with video player */
  syncWithVideo: (currentTime: number, duration: number) => void;
}

/**
 * UI store state
 */
export interface UIStoreState {
  /** Current theme mode */
  theme: ThemeMode;
  /** Toast notifications */
  toasts: Toast[];
  /** Loading states by key */
  loadingStates: Record<string, LoadingState>;
  /** Sidebar collapsed state */
  sidebarCollapsed: boolean;
  /** Active modals */
  modals: Record<string, boolean>;
}

/**
 * UI store actions
 */
export interface UIStoreActions {
  /** Set theme mode */
  setTheme: (theme: ThemeMode) => void;
  /** Add toast notification */
  addToast: (toast: Omit<Toast, 'id'>) => void;
  /** Remove toast notification */
  removeToast: (id: string) => void;
  /** Set loading state */
  setLoading: (key: string, state: LoadingState) => void;
  /** Clear loading state */
  clearLoading: (key: string) => void;
  /** Toggle sidebar */
  toggleSidebar: () => void;
  /** Open modal */
  openModal: (key: string) => void;
  /** Close modal */
  closeModal: (key: string) => void;
}

/**
 * Root store interface combining all stores
 */
export interface RootStore {
  /** Camera-related state and actions */
  cameras: CameraStoreState & CameraStoreActions;
  /** Incident-related state and actions */
  incidents: IncidentStoreState & IncidentStoreActions;
  /** Timeline-related state and actions */
  timeline: TimelineStoreState & TimelineStoreActions;
  /** UI-related state and actions */
  ui: UIStoreState & UIStoreActions;
  /** Reset entire store */
  reset: () => void;
  /** Initialize store */
  initialize: () => Promise<void>;
}
