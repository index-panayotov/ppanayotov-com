/**
 * API Client with Request Deduplication and Caching
 *
 * Features:
 * - Request deduplication (prevents duplicate concurrent requests)
 * - Response caching with TTL
 * - Automatic retries with exponential backoff
 * - Request timeout handling
 * - Error handling and logging
 */

import { retryFetch } from './retry-logic';
import { logger } from './logger';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface RequestOptions extends RequestInit {
  /**
   * Cache TTL in milliseconds
   * @default 60000 (1 minute)
   */
  cacheTTL?: number;

  /**
   * Request timeout in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Number of retry attempts
   * @default 3
   */
  retries?: number;

  /**
   * Skip cache and force fresh request
   * @default false
   */
  skipCache?: boolean;

  /**
   * Skip request deduplication
   * @default false
   */
  skipDedup?: boolean;
}

class APIClient {
  private cache = new Map<string, CacheEntry<unknown>>();
  private pendingRequests = new Map<string, Promise<unknown>>();

  /**
   * Make a GET request with caching and deduplication
   */
  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * Make a POST request
   */
  async post<T>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  /**
   * Make a PUT request
   */
  async put<T>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  /**
   * Upload a file with FormData
   */
  async upload<T>(url: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
    const {
      timeout = 60000, // Longer timeout for uploads
      retries = 1,
      ...fetchOptions
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await retryFetch(
        url,
        {
          method: 'POST',
          body: formData,
          signal: controller.signal,
          ...fetchOptions,
          // Don't set Content-Type header - browser will set it with boundary
        },
        {
          maxAttempts: retries,
          baseDelay: 1000,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Validate response has json method before calling
      if (typeof response.json !== 'function') {
        console.error('Invalid upload response object:', response);
        throw new Error('Invalid response: response.json is not a function');
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Upload timeout after ${timeout}ms: ${url}`);
        }
      }

      throw error;
    }
  }

  /**
   * Main request method with all optimizations
   */
  private async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const {
      cacheTTL = 60000,
      timeout = 30000,
      retries = 3,
      skipCache = false,
      skipDedup = false,
      ...fetchOptions
    } = options;

    const cacheKey = this.getCacheKey(url, fetchOptions);
    const isGetRequest = !fetchOptions.method || fetchOptions.method === 'GET';

    // Check cache for GET requests
    if (isGetRequest && !skipCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached !== null) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug(`📦 Cache hit: ${url}`);
        }
        return cached;
      }
    }

    // Check for pending request (deduplication)
    if (isGetRequest && !skipDedup) {
      const pending = this.pendingRequests.get(cacheKey);
      if (pending) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug(`🔄 Deduped request: ${url}`);
        }
        return pending;
      }
    }

    // Make the request
    const requestPromise = this.executeRequest<T>(url, fetchOptions, timeout, retries);

    // Store pending request for deduplication
    if (isGetRequest && !skipDedup) {
      this.pendingRequests.set(cacheKey, requestPromise);
    }

    try {
      const data = await requestPromise;

      // Cache GET responses
      if (isGetRequest && !skipCache) {
        this.setCache(cacheKey, data, cacheTTL);
      }

      return data;
    } finally {
      // Remove from pending requests
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Execute the actual request with timeout and retries
   */
  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    timeout: number,
    retries: number
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await retryFetch(
        url,
        {
          ...options,
          signal: controller.signal,
        },
        {
          maxAttempts: retries,
          baseDelay: 1000,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Validate response has json method before calling
      if (typeof response.json !== 'function') {
        console.error('Invalid response object:', response);
        throw new Error('Invalid response: response.json is not a function');
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms: ${url}`);
        }
      }

      throw error;
    }
  }

  /**
   * Generate cache key from URL and options
   */
  private getCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * Get data from cache if valid
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if cache is expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set data in cache
   */
  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Limit cache size
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cache for specific URL pattern
   */
  clearCacheByPattern(pattern: string | RegExp): void {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const apiClient = new APIClient();

export default apiClient;
