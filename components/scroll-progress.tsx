"use client"

import { useEffect, useState, useRef } from "react"

/**
 * Renders a thin, fixed horizontal progress bar at the top of the page that reflects vertical scroll progress.
 *
 * Optimized with requestAnimationFrame for better performance.
 * The inner bar width is updated on mount and whenever the window scrolls to represent the current
 * document scroll position as a percentage (0–100).
 *
 * Performance optimizations:
 * - Uses requestAnimationFrame for smooth 60fps updates
 * - Prevents excessive re-renders during scroll
 * - Properly cancels RAF on unmount
 *
 * @returns The progress bar as a JSX element.
 */
export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const rafId = useRef<number | null>(null)
  const ticking = useRef(false)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
      setScrollProgress(progress)
      ticking.current = false
    }

    const requestTick = () => {
      if (!ticking.current) {
        rafId.current = requestAnimationFrame(updateScrollProgress)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true })
    updateScrollProgress() // Initial calculation

    return () => {
      window.removeEventListener('scroll', requestTick)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-slate-200/50 z-50 print:hidden">
      <div 
        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}