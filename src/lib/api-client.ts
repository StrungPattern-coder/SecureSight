/**
 * @fileoverview API client configuration and utilities
 * @description Centralized API client with error handling, retries, and authentication
 * @version 1.0.0
 */

import { ApiResponse, ApiError, RequestConfig, HttpMethod } from '@/types/api.types';

/**
 * API client configuration
 */
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retryAttempts: number;
  retryDelay: number;
}

/**
 * Default API client configuration
 */
const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  retryAttempts: 3,
  retryDelay: 1000,
};

/**
 * HTTP status codes that indicate success
 */
const SUCCESS_CODES = [200, 201, 202, 204];

/**
 * HTTP status codes that should trigger a retry
 */
const RETRY_CODES = [408, 429, 500, 502, 503, 504];

/**
 * Professional API client class
 */
export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Generic request method with error handling and retries
   */
  private async request<T>(
    endpoint: string,
    options: RequestConfig & { method: HttpMethod } = { method: 'GET' }
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const controller = new AbortController();
    
    // Set up timeout
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.config.timeout);

    try {
      const response = await this.executeWithRetry(async () => {
        const fetchOptions: RequestInit = {
          method: options.method,
          headers: {
            ...this.config.headers,
            ...options.headers,
          },
          signal: controller.signal,
          credentials: options.credentials ? 'include' : 'same-origin',
        };

        // Add body for non-GET requests
        if (options.body && options.method !== 'GET') {
          fetchOptions.body = typeof options.body === 'string' 
            ? options.body 
            : JSON.stringify(options.body);
        }

        // Add query parameters
        const urlWithParams = this.buildUrlWithParams(url, options.params);
        
        return fetch(urlWithParams, fetchOptions);
      }, options.retry);

      clearTimeout(timeoutId);

      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retryConfig?: { attempts: number; delay: number }
  ): Promise<T> {
    const maxAttempts = retryConfig?.attempts || this.config.retryAttempts;
    const delay = retryConfig?.delay || this.config.retryDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await operation();
        
        // Check if we should retry based on response status
        if (result instanceof Response && RETRY_CODES.includes(result.status)) {
          if (attempt === maxAttempts) {
            throw new Error(`Request failed after ${maxAttempts} attempts`);
          }
          await this.sleep(delay * attempt);
          continue;
        }

        return result;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        
        // Only retry on network errors or retryable status codes
        if (this.isRetryableError(error)) {
          await this.sleep(delay * attempt);
          continue;
        }
        
        throw error;
      }
    }

    throw new Error('Unexpected retry loop exit');
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const isSuccess = SUCCESS_CODES.includes(response.status);
    
    try {
      const data = await response.json();
      
      return {
        data: isSuccess ? data : undefined,
        success: isSuccess,
        message: data.message || response.statusText,
        errors: data.errors || [],
        meta: {
          timestamp: new Date().toISOString(),
          requestId: response.headers.get('x-request-id') || 'unknown',
          version: response.headers.get('x-api-version') || '1.0',
        },
      };
    } catch {
      return {
        success: isSuccess,
        message: isSuccess ? 'Success' : `HTTP ${response.status}: ${response.statusText}`,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: response.headers.get('x-request-id') || 'unknown',
          version: response.headers.get('x-api-version') || '1.0',
        },
      };
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          code: 'REQUEST_TIMEOUT',
          message: 'Request timed out',
        };
      }

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return {
          code: 'NETWORK_ERROR',
          message: 'Network connection failed',
        };
      }

      return {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred',
        context: { originalError: error },
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      context: { originalError: error },
    };
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.name === 'TypeError' || // Network errors
        error.name === 'AbortError' // Timeout errors
      );
    }
    
    // Check for HTTP status codes on response-like objects
    if (typeof error === 'object' && error !== null && 'status' in error) {
      return RETRY_CODES.includes((error as { status: number }).status);
    }
    
    return false;
  }

  /**
   * Build URL with query parameters
   */
  private buildUrlWithParams(url: string, params?: Record<string, unknown>): string {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const paramString = searchParams.toString();
    return paramString ? `${url}?${paramString}` : url;
  }

  /**
   * Sleep utility for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public HTTP methods
  
  /**
   * GET request
   */
  public async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  public async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
  }

  /**
   * PUT request
   */
  public async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
  }

  /**
   * PATCH request
   */
  public async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body: data });
  }

  /**
   * DELETE request
   */
  public async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient();

/**
 * Create authenticated API client
 */
export const createAuthenticatedClient = (token: string): ApiClient => {
  return new ApiClient({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};
