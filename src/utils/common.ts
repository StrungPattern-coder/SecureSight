/**
 * @fileoverview Common utility functions
 * @description General-purpose utility functions for the application
 */

/**
 * Type guards and validation utilities
 */
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isNumber = (value: unknown): value is number => typeof value === 'number';
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
export const isObject = (value: unknown): value is Record<string, unknown> => 
  value !== null && typeof value === 'object' && !Array.isArray(value);
export const isArray = Array.isArray;
export const isNull = (value: unknown): value is null => value === null;
export const isUndefined = (value: unknown): value is undefined => value === undefined;
export const isNullish = (value: unknown): value is null | undefined => value == null;

/**
 * Array utilities
 */
export const unique = <T>(array: T[]): T[] => [...new Set(array)];

export const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Object utilities
 */
export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(deepClone) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    Object.keys(obj).forEach((key) => {
      (clonedObj as Record<string, unknown>)[key] = deepClone((obj as Record<string, unknown>)[key]);
    });
    return clonedObj;
  }
  return obj;
};

/**
 * String utilities
 */
export const capitalize = (str: string): string => 
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const camelCase = (str: string): string =>
  str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());

export const kebabCase = (str: string): string =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export const truncate = (str: string, length: number, suffix = '...'): string =>
  str.length <= length ? str : str.slice(0, length - suffix.length) + suffix;

/**
 * Number utilities
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const round = (value: number, decimals = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

export const random = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const randomInt = (min: number, max: number): number =>
  Math.floor(random(min, max + 1));

/**
 * Promise utilities
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);

export const retry = async <T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    await delay(delayMs);
    return retry(fn, attempts - 1, delayMs);
  }
};

/**
 * Date utilities
 */
export const formatDate = (date: Date, format = 'YYYY-MM-DD'): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * URL utilities
 */
export const buildUrl = (base: string, params: Record<string, string | number | boolean>): string => {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

export const parseQueryString = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/**
 * Storage utilities
 */
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch {
      return defaultValue ?? null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail in case localStorage is not available
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail in case localStorage is not available
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      // Silently fail in case localStorage is not available
    }
  },
};

/**
 * Event utilities
 */
export const debounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends unknown[]>(
  fn: (...args: T) => void,
  limit: number
): ((...args: T) => void) => {
  let inThrottle: boolean;
  return (...args: T) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
