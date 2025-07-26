/**
 * @fileoverview Incident-related type definitions
 * @description Types for security incidents, alerts, and events
 */

/**
 * Incident type enumeration
 */
export enum IncidentType {
  INTRUSION = 'intrusion',
  MOTION = 'motion',
  OBJECT_LEFT = 'object_left',
  LOITERING = 'loitering',
  FACE_RECOGNITION = 'face_recognition',
  PERIMETER_BREACH = 'perimeter_breach',
  FIRE = 'fire',
  CROWD = 'crowd',
  VEHICLE = 'vehicle',
  WEAPON = 'weapon'
}

/**
 * Incident severity levels
 */
export enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Incident status enumeration
 */
export enum IncidentStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  INVESTIGATING = 'investigating',
  FALSE_POSITIVE = 'false_positive'
}

/**
 * Incident entity interface
 */
export interface Incident {
  /** Unique identifier */
  id: string;
  /** Associated camera ID */
  cameraId: string;
  /** Type of incident */
  type: IncidentType;
  /** Severity level */
  severity: IncidentSeverity;
  /** Current status */
  status: IncidentStatus;
  /** Incident start timestamp */
  timestamp: Date;
  /** Incident end timestamp */
  endTimestamp?: Date;
  /** Thumbnail/screenshot URL */
  thumbnailUrl?: string;
  /** Video clip URL */
  videoUrl?: string;
  /** Human-readable description */
  description?: string;
  /** AI confidence score (0-1) */
  confidence?: number;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  /** Resolution notes */
  resolutionNotes?: string;
  /** Assigned investigator */
  assignedTo?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Incident creation payload
 */
export interface CreateIncidentRequest {
  cameraId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Incident update payload
 */
export interface UpdateIncidentRequest {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  description?: string;
  resolutionNotes?: string;
  assignedTo?: string;
  endTimestamp?: Date;
}

/**
 * Incident filter options
 */
export interface IncidentFilters {
  cameraId?: string;
  type?: IncidentType[];
  severity?: IncidentSeverity[];
  status?: IncidentStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

/**
 * Incident statistics
 */
export interface IncidentStats {
  total: number;
  byType: Record<IncidentType, number>;
  bySeverity: Record<IncidentSeverity, number>;
  byStatus: Record<IncidentStatus, number>;
  todayCount: number;
  weekCount: number;
  monthCount: number;
}
