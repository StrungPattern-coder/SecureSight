/**
 * @fileoverview API-related type definitions
 * @description Types for API requests, responses, and error handling
 */

/**
 * HTTP methods enumeration
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

/**
 * API response status codes
 */
export enum ApiStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  /** Response data */
  data?: T;
  /** Success indicator */
  success: boolean;
  /** Error message */
  message?: string;
  /** Additional error details */
  errors?: string[];
  /** Response metadata */
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  /** Pagination metadata */
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * API error details
 */
export interface ApiError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Field-specific errors */
  field?: string;
  /** Additional context */
  context?: Record<string, any>;
}

/**
 * Request configuration
 */
export interface RequestConfig {
  /** Request timeout in ms */
  timeout?: number;
  /** Request headers */
  headers?: Record<string, string>;
  /** Query parameters */
  params?: Record<string, any>;
  /** Request body */
  body?: any;
  /** Whether to include credentials */
  credentials?: boolean;
  /** Retry configuration */
  retry?: {
    attempts: number;
    delay: number;
  };
}

/**
 * WebSocket message types
 */
export enum WebSocketMessageType {
  CAMERA_STATUS = 'camera_status',
  NEW_INCIDENT = 'new_incident',
  INCIDENT_UPDATE = 'incident_update',
  SYSTEM_ALERT = 'system_alert',
  HEARTBEAT = 'heartbeat'
}

/**
 * WebSocket message interface
 */
export interface WebSocketMessage<T = any> {
  /** Message type */
  type: WebSocketMessageType;
  /** Message payload */
  payload: T;
  /** Timestamp */
  timestamp: string;
  /** Message ID */
  id?: string;
}

/**
 * Real-time event types
 */
export interface CameraStatusEvent {
  cameraId: string;
  status: string;
  lastSeen: string;
}

export interface NewIncidentEvent {
  incident: {
    id: string;
    cameraId: string;
    type: string;
    severity: string;
    timestamp: string;
    thumbnailUrl?: string;
  };
}

export interface IncidentUpdateEvent {
  incidentId: string;
  updates: Record<string, any>;
}

export interface SystemAlertEvent {
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}
