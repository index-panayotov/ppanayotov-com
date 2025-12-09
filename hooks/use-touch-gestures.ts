import { useRef, useCallback } from 'react';

/**
 * Hook for detecting horizontal swipe gestures on touch devices
 * @param onSwipeLeft - Callback when swiping left
 * @param onSwipeRight - Callback when swiping right
 * @param threshold - Minimum distance in pixels to trigger swipe (default: 50)
 * @returns ref to attach to the element that should detect swipes
 */
export function useHorizontalSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold: number = 50
) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null || !e.changedTouches[0]) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;

    // Only trigger if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  const ref = useRef<HTMLElement>(null);

  const setRef = useCallback((element: HTMLElement | null) => {
    if (ref.current) {
      ref.current.removeEventListener('touchstart', handleTouchStart);
      ref.current.removeEventListener('touchend', handleTouchEnd);
    }

    ref.current = element;

    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: true });
      element.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  }, [handleTouchStart, handleTouchEnd]);

  return setRef;
}