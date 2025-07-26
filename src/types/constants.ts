/**
 * @fileoverview Application constants and configuration
 * @description Global constants, default values, and configuration settings
 */

/**
 * Application metadata
 */
export const APP_CONFIG = {
  name: 'SecureSight Dashboard',
  version: '2.0.0',
  description: 'Modern surveillance dashboard for security monitoring',
  author: 'SecureSight Team',
  repository: 'https://github.com/StrungPattern-coder/SecureSight',
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

/**
 * UI constants
 */
export const UI_CONSTANTS = {
  // Animation durations (ms)
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // Breakpoints (px)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  
  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 2000,
    TOOLTIP: 3000,
    NOTIFICATION: 4000,
  },
  
  // Component sizes
  SIZES: {
    NAVBAR_HEIGHT: 72,
    SIDEBAR_WIDTH: 256,
    FOOTER_HEIGHT: 64,
  },
} as const;

/**
 * Video player constants
 */
export const VIDEO_CONFIG = {
  // Supported formats
  FORMATS: ['mp4', 'webm', 'ogg'],
  
  // Default settings
  DEFAULTS: {
    VOLUME: 0.8,
    PLAYBACK_RATE: 1.0,
    QUALITY: '1080p',
  },
  
  // Quality options
  QUALITY_OPTIONS: [
    { label: '4K', value: '2160p', bitrate: 15000 },
    { label: '1080p', value: '1080p', bitrate: 8000 },
    { label: '720p', value: '720p', bitrate: 5000 },
    { label: '480p', value: '480p', bitrate: 2500 },
  ],
} as const;

/**
 * Timeline constants
 */
export const TIMELINE_CONFIG = {
  // Timeline divisions
  HOURS_PER_DAY: 24,
  MINUTES_PER_HOUR: 60,
  SECONDS_PER_MINUTE: 60,
  
  // Visual settings
  MARKER_SIZE: {
    SMALL: 4,
    MEDIUM: 6,
    LARGE: 8,
  },
  
  // Zoom levels
  ZOOM_LEVELS: [0.5, 1, 2, 4, 8, 16],
  DEFAULT_ZOOM: 1,
} as const;

/**
 * Security and validation constants
 */
export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: false,
  },
  
  // Session settings
  SESSION: {
    TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  },
  
  // Rate limiting
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  },
} as const;

/**
 * Data refresh intervals (ms)
 */
export const REFRESH_INTERVALS = {
  REAL_TIME: 1000,
  FAST: 5000,
  NORMAL: 15000,
  SLOW: 60000,
  VERY_SLOW: 300000,
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  THEME: 'securesight-theme',
  SIDEBAR_STATE: 'securesight-sidebar',
  USER_PREFERENCES: 'securesight-preferences',
  CAMERA_LAYOUT: 'securesight-camera-layout',
  INCIDENT_FILTERS: 'securesight-incident-filters',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  SAVE: 'Changes saved successfully.',
  DELETE: 'Item deleted successfully.',
  CREATE: 'Item created successfully.',
  UPDATE: 'Item updated successfully.',
  LOGIN: 'Welcome back!',
  LOGOUT: 'You have been logged out successfully.',
} as const;

/**
 * Default pagination settings
 */
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_VISIBLE_PAGES: 7,
} as const;

/**
 * File upload constraints
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
    DOCUMENT: ['application/pdf', 'text/plain'],
  },
} as const;
