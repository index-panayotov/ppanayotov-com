"use client"

import { useEffect, useState } from "react"

/**
 * Renders a thin, fixed horizontal progress bar at the top of the page that reflects vertical scroll progress.
 *
 * The inner bar width is updated on mount and whenever the window scrolls to represent the current
 * document scroll position as a percentage (0–100). The component reads `window.scrollY` and
 * `document.documentElement.scrollHeight`, and removes its scroll listener on unmount.
 *
 * Notes:
 * - Designed for client-side usage (reads `window` / `document`).
 * - The outer container is hidden when printing.
 *
 * @returns The progress bar as a JSX element.
 */
export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', updateScrollProgress)
    updateScrollProgress()

    return () => window.removeEventListener('scroll', updateScrollProgress)
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