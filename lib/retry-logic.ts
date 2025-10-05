/**
 * Retry Logic Utilities
 *
 * Provides exponential backoff retry functionality for API calls
 * and other operations that may fail temporarily.
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: Error) => boolean;
}

export interface RetryState {
  attempt: number;
  delay: number;
  error: Error | null;
}

/**
 * Default retry condition - retry on network errors and 5xx status codes
 */
export function defaultRetryCondition(error: any): boolean {
  // Network errors
  if (!error.response) return true;

  // Server errors (5xx)
  const status = error.response?.status || error.status;
  return status >= 500 && status < 600;
}

/**
 * Calculate delay for exponential backoff
 */
export function calculateDelay(
  attempt: number,
  baseDelay: number = 1000,
  maxDelay: number = 30000,
  backoffFactor: number = 2
): number {
  const delay = baseDelay * Math.pow(backoffFactor, attempt - 1);
  return Math.min(delay, maxDelay);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    retryCondition = defaultRetryCondition,
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt or if condition doesn't match
      if (attempt === maxAttempts || !retryCondition(lastError)) {
        throw lastError;
      }

      const delay = calculateDelay(attempt, baseDelay, maxDelay, backoffFactor);
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, lastError.message);

      await sleep(delay);
    }
  }

  throw lastError!;
}

/**
 * Create a retry wrapper function
 */
export function createRetryWrapper<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: RetryOptions
): T {
  return ((...args: Parameters<T>) =>
    withRetry(() => fn(...args), options)) as T;
}

/**
 * Retry hook for React components
 */
export function useRetry(options?: RetryOptions) {
  return {
    execute: <T>(fn: () => Promise<T>) => withRetry(fn, options),
    wrap: <T extends (...args: any[]) => Promise<any>>(fn: T) =>
      createRetryWrapper(fn, options),
  };
}

/**
 * Fetch with retry logic
 */
export async function retryFetch(
  url: string,
  options?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return withRetry(async () => {
    const response = await fetch(url, options);

    // Throw error for non-ok responses so they can be retried
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  }, retryOptions);
}