"use client"

import { useEffect, useState, useRef } from "react"
// Optimized individual icon import for better tree-shaking
import { FiArrowUp } from "react-icons/fi"

/**
 * A client-side React component that renders a floating "Back to top" button.
 *
 * Optimized with requestAnimationFrame for better scroll performance.
 * The button becomes visible when the page is scrolled more than 300 pixels.
 * Clicking the button scrolls the window to the top with a smooth animation.
 *
 * Performance optimizations:
 * - Uses RAF throttling for scroll events
 * - Prevents excessive visibility state updates
 * - Properly cancels RAF on unmount
 */
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const rafId = useRef<number | null>(null)
  const ticking = useRef(false)

  useEffect(() => {
    const toggleVisibility = () => {
      const shouldBeVisible = window.scrollY > 300
      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible)
      }
      ticking.current = false
    }

    const requestTick = () => {
      if (!ticking.current) {
        rafId.current = requestAnimationFrame(toggleVisibility)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true })

    return () => {
      window.removeEventListener('scroll', requestTick)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [isVisible])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 print:hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <FiArrowUp size={20} />
    </button>
  )
}