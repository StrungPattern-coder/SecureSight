/**
 * @fileoverview Central type exports and utility types
 * @description Professional type management and utility types for the SecureSight Dashboard
 */

// Domain Types
export * from './camera.types';
export * from './incident.types';
export * from './timeline.types';

// Infrastructure Types
export * from './api.types';
export * from './store.types';

// UI and Component Types
export * from './ui.types';

// Constants and Configuration
export * from './constants';

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Object utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Array utility types
export type ArrayElement<T> = T extends (infer U)[] ? U : never;
export type NonEmptyArray<T> = [T, ...T[]];

// Promise utility types
export type Awaited<T> = T extends Promise<infer U> ? U : T;
export type PromiseReturnType<T extends (...args: unknown[]) => Promise<unknown>> = 
  T extends (...args: unknown[]) => Promise<infer R> ? R : never;

// Function utility types
export type Parameters<T extends (...args: unknown[]) => unknown> = T extends (...args: infer P) => unknown ? P : never;
export type ReturnType<T extends (...args: unknown[]) => unknown> = T extends (...args: unknown[]) => infer R ? R : unknown;

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Component prop types
export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;
export type ComponentRef<T> = T extends React.ComponentType<unknown> ? React.ComponentRef<T> : never;

// API utility types
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}>;

// Form utility types
export type FormState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
};

// Theme utility types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeColors = Record<string, string>;

// Status types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting' | 'error';

// Time utility types
export type Timestamp = number;
export type DateString = string;
export type TimeRange = {
  start: Timestamp;
  end: Timestamp;
};

// Generic data structures
export type Dictionary<T = unknown> = Record<string, T>;
export type Entries<T> = Array<[keyof T, T[keyof T]]>;
export type Values<T> = T[keyof T];
export type Keys<T> = keyof T;
