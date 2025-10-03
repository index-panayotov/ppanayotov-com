"use client"

import { useEffect, useRef, useState, useCallback } from 'react';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventScroll?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
}

/**
 * Custom hook for detecting touch gestures on mobile devices
 *
 * @param options Configuration object for gesture callbacks and behavior
 * @returns Ref to attach to the element that should detect gestures
 *
 * @example
 * const gestureRef = useTouchGestures({
 *   onSwipeLeft: () => console.log('Swiped left'),
 *   onSwipeRight: () => console.log('Swiped right'),
 *   threshold: 75
 * });
 *
 * return <div ref={gestureRef}>Swipeable content</div>
 */
export const useTouchGestures = (options: TouchGestureOptions) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<TouchPoint>({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState<TouchPoint>({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventScroll = false
  } = options;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.targetTouches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSwiping) return;

    const touch = e.targetTouches[0];
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY
    });

    // Prevent scroll if option is enabled and we're potentially swiping horizontally
    if (preventScroll) {
      const xDiff = Math.abs(touchStart.x - touch.clientX);
      const yDiff = Math.abs(touchStart.y - touch.clientY);

      if (xDiff > yDiff && xDiff > 10) {
        e.preventDefault();
      }
    }
  }, [touchStart, isSwiping, preventScroll]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping) return;

    setIsSwiping(false);
    handleGesture();
  }, [isSwiping, touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const handleGesture = useCallback(() => {
    const xDiff = touchStart.x - touchEnd.x;
    const yDiff = touchStart.y - touchEnd.y;

    // Check if the movement is significant enough
    const absXDiff = Math.abs(xDiff);
    const absYDiff = Math.abs(yDiff);

    if (absXDiff < threshold && absYDiff < threshold) {
      return; // Movement too small, ignore
    }

    // Determine if it's primarily horizontal or vertical swipe
    if (absXDiff > absYDiff) {
      // Horizontal swipe
      if (absXDiff > threshold) {
        if (xDiff > 0) {
          onSwipeLeft?.();
        } else {
          onSwipeRight?.();
        }
      }
    } else {
      // Vertical swipe
      if (absYDiff > threshold) {
        if (yDiff > 0) {
          onSwipeUp?.();
        } else {
          onSwipeDown?.();
        }
      }
    }
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add touch event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup function
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return elementRef;
};

/**
 * Hook for detecting horizontal swipes specifically (useful for navigation)
 */
export const useHorizontalSwipe = (onLeft: () => void, onRight: () => void, threshold = 75) => {
  return useTouchGestures({
    onSwipeLeft: onLeft,
    onSwipeRight: onRight,
    threshold,
    preventScroll: true
  });
};

/**
 * Hook for detecting vertical swipes specifically (useful for scrolling controls)
 */
export const useVerticalSwipe = (onUp: () => void, onDown: () => void, threshold = 75) => {
  return useTouchGestures({
    onSwipeUp: onUp,
    onSwipeDown: onDown,
    threshold,
    preventScroll: false
  });
};