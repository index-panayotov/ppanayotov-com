"use client"

import { useState, useEffect, memo } from "react"

interface TypingEffectProps {
  text: string
  speed?: number
  className?: string
}

/**
 * Animated typing React client component that reveals `text` one character at a time.
 *
 * Renders the progressively revealed text and, while typing, a blinking cursor (`|`).
 *
 * @param text - The full text to animate.
 * @param speed - Delay in milliseconds between each character (default: 100).
 * @param className - Optional CSS class applied to the outer wrapper (default: "").
 * @returns A React element containing the typed text and a blinking cursor until completion.
 */
export const TypingEffect = memo(function TypingEffect({ text, speed = 100, className = "" }: TypingEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Reset state when text prop changes
  useEffect(() => {
    setDisplayText('')
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed])

  return (
    <span
      className={className}
      aria-live="polite"
      aria-atomic="true"
      role="text"
    >
      {displayText}
      {!isComplete && (
        <span className="animate-pulse text-slate-400" aria-hidden="true">|</span>
      )}
    </span>
  )
});