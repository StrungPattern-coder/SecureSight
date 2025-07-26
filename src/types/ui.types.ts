/**
 * @fileoverview UI-related type definitions
 * @description Types for UI components, themes, and user interactions
 */

import { ReactNode } from 'react';

/**
 * Theme mode enumeration
 */
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

/**
 * Navigation item interface
 */
export interface NavItem {
  /** Display label */
  label: string;
  /** Navigation path */
  href: string;
  /** Icon component */
  icon?: ReactNode;
  /** Whether item is active */
  isActive?: boolean;
  /** Badge count */
  badge?: number;
}

/**
 * Modal configuration
 */
export interface ModalConfig {
  /** Whether modal is open */
  isOpen: boolean;
  /** Modal title */
  title: string;
  /** Modal content */
  content?: ReactNode;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm callback */
  onConfirm?: () => void;
  /** Cancel callback */
  onCancel?: () => void;
}

/**
 * Toast notification types
 */
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

/**
 * Toast notification interface
 */
export interface Toast {
  /** Unique identifier */
  id: string;
  /** Notification type */
  type: ToastType;
  /** Message text */
  message: string;
  /** Optional description */
  description?: string;
  /** Auto-dismiss duration in ms */
  duration?: number;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Loading state interface
 */
export interface LoadingState {
  /** Whether currently loading */
  isLoading: boolean;
  /** Loading message */
  message?: string;
  /** Progress percentage (0-100) */
  progress?: number;
}

/**
 * Pagination interface
 */
export interface Pagination {
  /** Current page (1-based) */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether has previous page */
  hasPrevious: boolean;
  /** Whether has next page */
  hasNext: boolean;
}

/**
 * Sort configuration
 */
export interface SortConfig<T = string> {
  /** Field to sort by */
  field: T;
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Table column configuration
 */
export interface TableColumn<T = any> {
  /** Column key */
  key: string;
  /** Display label */
  label: string;
  /** Whether sortable */
  sortable?: boolean;
  /** Custom render function */
  render?: (value: any, row: T) => ReactNode;
  /** Column width */
  width?: string | number;
  /** Whether column is hidden */
  hidden?: boolean;
}

/**
 * Form field validation
 */
export interface FieldValidation {
  /** Whether field is required */
  required?: boolean;
  /** Minimum length */
  minLength?: number;
  /** Maximum length */
  maxLength?: number;
  /** Regex pattern */
  pattern?: RegExp;
  /** Custom validator function */
  validator?: (value: any) => string | null;
}

/**
 * Form field configuration
 */
export interface FormField {
  /** Field name */
  name: string;
  /** Display label */
  label: string;
  /** Input type */
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';
  /** Placeholder text */
  placeholder?: string;
  /** Default value */
  defaultValue?: any;
  /** Options for select/radio */
  options?: Array<{ label: string; value: any }>;
  /** Validation rules */
  validation?: FieldValidation;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Help text */
  helpText?: string;
}
