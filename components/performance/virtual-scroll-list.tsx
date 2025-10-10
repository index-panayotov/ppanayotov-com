/**
 * Virtual Scrolling List Component
 *
 * Performance-optimized virtual scrolling for large lists:
 * - Only renders visible items
 * - Maintains smooth scrolling performance
 * - Supports variable item heights
 * - Memory efficient for large datasets
 * - Accessibility compliant
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface VirtualScrollListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  getItemKey?: (item: T, index: number) => string | number;
}

/**
 * Virtual Scroll List Component
 * Renders only visible items for optimal performance with large datasets
 */
export function VirtualScrollList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  getItemKey
}: VirtualScrollListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Calculate visible range with overscan for smooth scrolling
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items based on calculated range
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  // Calculate total height and offset for positioning
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  // Optimized scroll handler with throttling
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;

    // Only update if scroll position actually changed
    if (newScrollTop !== lastScrollTop.current) {
      setScrollTop(newScrollTop);
      lastScrollTop.current = newScrollTop;
      onScroll?.(newScrollTop);

      // Mark as scrolling for performance optimizations
      isScrolling.current = true;

      // Clear previous timeout and set new one
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 150);
    }
  }, [onScroll]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Performance monitoring in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const visibleCount = visibleRange.endIndex - visibleRange.startIndex + 1;
      logger.debug(`📊 VirtualScrollList: Rendering ${visibleCount}/${items.length} items`);
    }
  }, [visibleRange, items.length]);

  // Scroll to item programmatically
  const scrollToItem = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!scrollElementRef.current) return;

    let scrollTop: number;
    switch (align) {
      case 'center':
        scrollTop = index * itemHeight - containerHeight / 2 + itemHeight / 2;
        break;
      case 'end':
        scrollTop = index * itemHeight - containerHeight + itemHeight;
        break;
      case 'start':
      default:
        scrollTop = index * itemHeight;
        break;
    }

    scrollElementRef.current.scrollTo({
      top: Math.max(0, Math.min(scrollTop, totalHeight - containerHeight)),
      behavior: 'smooth'
    });
  }, [itemHeight, containerHeight, totalHeight]);

  // Generate stable keys for items
  const generateItemKey = useCallback((item: T, index: number) => {
    if (getItemKey) {
      return getItemKey(item, visibleRange.startIndex + index);
    }
    return visibleRange.startIndex + index;
  }, [getItemKey, visibleRange.startIndex]);

  return (
    <div
      ref={scrollElementRef}
      className={`relative overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      role="listbox"
      aria-label={`Virtual list with ${items.length} items`}
      tabIndex={0}
    >
      {/* Total height spacer */}
      <div
        style={{ height: totalHeight, position: 'relative' }}
        role="presentation"
      >
        {/* Visible items container */}
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            willChange: isScrolling.current ? 'transform' : 'auto'
          }}
          role="presentation"
        >
          {visibleItems.map((item, index) => {
            const itemKey = generateItemKey(item, index);
            const globalIndex = visibleRange.startIndex + index;

            return (
              <div
                key={itemKey}
                style={{
                  height: itemHeight,
                  overflow: 'hidden'
                }}
                role="option"
                aria-setsize={items.length}
                aria-posinset={globalIndex + 1}
              >
                {renderItem(item, globalIndex)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Development performance indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-50">
          {visibleRange.endIndex - visibleRange.startIndex + 1}/{items.length} rendered
        </div>
      )}
    </div>
  );
}

/**
 * Virtual Scroll List with Search and Filtering
 * Enhanced version with built-in search and filter capabilities
 */
interface VirtualScrollListWithSearchProps<T> extends Omit<VirtualScrollListProps<T>, 'items'> {
  items: T[];
  searchQuery?: string;
  filterFunction?: (item: T, query: string) => boolean;
  placeholder?: string;
  onSearchChange?: (query: string) => void;
}

export function VirtualScrollListWithSearch<T>({
  items,
  searchQuery = '',
  filterFunction,
  placeholder = 'Search items...',
  onSearchChange,
  ...virtualScrollProps
}: VirtualScrollListWithSearchProps<T>) {
  const [internalSearchQuery, setInternalSearchQuery] = useState(searchQuery);

  // Use controlled or uncontrolled search
  const currentSearchQuery = onSearchChange ? searchQuery : internalSearchQuery;

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!currentSearchQuery.trim() || !filterFunction) {
      return items;
    }
    return items.filter(item => filterFunction(item, currentSearchQuery));
  }, [items, currentSearchQuery, filterFunction]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (onSearchChange) {
      onSearchChange(query);
    } else {
      setInternalSearchQuery(query);
    }
  }, [onSearchChange]);

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={currentSearchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Results info */}
      {currentSearchQuery && (
        <div className="text-sm text-slate-600">
          {filteredItems.length === 0 ? (
            'No items match your search'
          ) : (
            `Showing ${filteredItems.length} of ${items.length} items`
          )}
        </div>
      )}

      {/* Virtual scroll list */}
      <VirtualScrollList
        {...virtualScrollProps}
        items={filteredItems}
      />
    </div>
  );
}

/**
 * Hook for managing virtual scroll state
 */
export function useVirtualScroll<T>(items: T[], itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight));
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  return {
    scrollTop,
    setScrollTop,
    visibleRange,
    visibleItems,
    totalHeight: items.length * itemHeight,
    offsetY: visibleRange.startIndex * itemHeight
  };
}

export default VirtualScrollList;