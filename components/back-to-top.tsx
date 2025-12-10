"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowUp } from "lucide-react"

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
  const [mounted, setMounted] = useState(false); // New state
  const rafId = useRef<number | null>(null)
  const ticking = useRef(false)

  useEffect(() => {
    setMounted(true); // Set mounted to true on client
    const toggleVisibility = () => {
      const shouldBeVisible = window.scrollY > 300
      setIsVisible(shouldBeVisible) // Call setIsVisible directly
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
  }, []) // Empty dependency array

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Back to top"
      aria-hidden={!mounted || !isVisible} // Use mounted state
      tabIndex={mounted && isVisible ? 0 : -1} // Use mounted state
    >
      <ArrowUp size={20} />
    </button>
  )
}