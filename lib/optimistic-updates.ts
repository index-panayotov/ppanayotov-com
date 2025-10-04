/**
 * Optimistic UI Update Utilities
 *
 * Provides helpers for implementing optimistic updates in the admin panel.
 * Updates UI immediately, then syncs with server - rolls back on error.
 *
 * Benefits:
 * - Instant feedback to users
 * - Better perceived performance
 * - Graceful error handling
 * - Automatic rollback on failure
 */

import { useState, useCallback } from 'react';

export interface OptimisticUpdateOptions<T> {
  /**
   * Function to update the server
   */
  updateFn: () => Promise<T>;

  /**
   * Success callback
   */
  onSuccess?: (data: T) => void;

  /**
   * Error callback with rollback data
   */
  onError?: (error: Error, rollbackData: any) => void;

  /**
   * Optional loading state callback
   */
  onLoading?: (isLoading: boolean) => void;
}

/**
 * Hook for optimistic updates
 */
export function useOptimisticUpdate<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (
      optimisticData: T,
      options: OptimisticUpdateOptions<T>
    ): Promise<boolean> => {
      const previousData = data;

      // Apply optimistic update immediately
      setData(optimisticData);
      setIsLoading(true);
      setError(null);

      if (options.onLoading) {
        options.onLoading(true);
      }

      try {
        // Attempt server update
        const result = await options.updateFn();

        // Success - keep optimistic data or use server response
        setData(result);
        setIsLoading(false);

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        if (options.onLoading) {
          options.onLoading(false);
        }

        return true;
      } catch (err) {
        // Rollback on error
        const error = err as Error;
        setData(previousData);
        setError(error);
        setIsLoading(false);

        if (options.onError) {
          options.onError(error, previousData);
        }

        if (options.onLoading) {
          options.onLoading(false);
        }

        console.error('Optimistic update failed, rolled back:', error);
        return false;
      }
    },
    [data]
  );

  return {
    data,
    setData,
    update,
    isLoading,
    error,
  };
}

/**
 * Optimistic list operations
 */
export class OptimisticList<T extends { id?: string }> {
  constructor(private items: T[]) {}

  /**
   * Add item optimistically
   */
  add(item: T): T[] {
    return [...this.items, item];
  }

  /**
   * Update item optimistically
   */
  update(id: string, updates: Partial<T>): T[] {
    return this.items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
  }

  /**
   * Delete item optimistically
   */
  delete(id: string): T[] {
    return this.items.filter(item => item.id !== id);
  }

  /**
   * Move item optimistically
   */
  move(fromIndex: number, toIndex: number): T[] {
    const newItems = [...this.items];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);
    return newItems;
  }

  /**
   * Reorder items optimistically
   */
  reorder(newOrder: string[]): T[] {
    const itemMap = new Map(this.items.map(item => [item.id, item]));
    return newOrder
      .map(id => itemMap.get(id))
      .filter((item): item is T => item !== undefined);
  }
}

/**
 * Create optimistic update for admin operations
 */
export function createOptimisticMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  return async (
    variables: TVariables,
    options: {
      onMutate?: (variables: TVariables) => any;
      onSuccess?: (data: TData, variables: TVariables) => void;
      onError?: (error: Error, variables: TVariables, rollback?: any) => void;
    } = {}
  ): Promise<TData | null> => {
    // Store rollback data from onMutate
    let rollbackData: any;

    try {
      // Run optimistic update
      if (options.onMutate) {
        rollbackData = options.onMutate(variables);
      }

      // Execute mutation
      const data = await mutationFn(variables);

      // Success callback
      if (options.onSuccess) {
        options.onSuccess(data, variables);
      }

      return data;
    } catch (error) {
      // Error callback with rollback
      if (options.onError) {
        options.onError(error as Error, variables, rollbackData);
      }

      console.error('Mutation failed:', error);
      return null;
    }
  };
}

/**
 * Debounced optimistic update
 * Useful for auto-save scenarios
 */
export function useDebouncedOptimisticUpdate<T>(
  initialData: T,
  debounceMs: number = 1000
) {
  const [data, setData] = useState<T>(initialData);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const debouncedUpdate = useCallback(
    (newData: T, updateFn: () => Promise<T>) => {
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Update UI immediately
      setData(newData);

      // Debounce server update
      const newTimeoutId = setTimeout(async () => {
        try {
          const result = await updateFn();
          setData(result);
        } catch (error) {
          console.error('Debounced update failed:', error);
          // Keep optimistic data, don't rollback
        }
      }, debounceMs);

      setTimeoutId(newTimeoutId);
    },
    [timeoutId, debounceMs]
  );

  return {
    data,
    setData,
    debouncedUpdate,
  };
}

export default useOptimisticUpdate;
