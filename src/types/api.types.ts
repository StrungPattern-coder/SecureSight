/**
 * @fileoverview API-related type definitions
 * @description Types for API requests, responses, and error handling
 */

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API error interface
 */
export interface ApiError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Error context */
  context?: Record<string, unknown>;
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
  params?: Record<string, string | number | boolean>;
  /** Request body */
  body?: unknown;
  /** Include credentials */
  credentials?: boolean;
  /** Retry configuration */
  retry?: {
    attempts: number;
    delay: number;
  };
}

/**
 * Generic API response interface
 */
export interface ApiResponse<T = unknown> {
  /** Response data */
  data?: T;
  /** Success status */
  success: boolean;
  /** Response message */
  message?: string;
  /** Validation errors */
  errors?: Record<string, string[]>;
  /** Response metadata */
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  /** Pagination metadata */
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * API client interface
 */
export interface ApiClient {
  get<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}
