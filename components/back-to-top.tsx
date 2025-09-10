"use client"

import { useEffect, useState } from "react"
import { FiArrowUp } from "react-icons/fi"

/**
 * A client-side React component that renders a floating "Back to top" button.
 *
 * The button becomes visible when the page is scrolled more than 300 pixels and is hidden otherwise.
 * Clicking the button scrolls the window to the top with a smooth animation. The component registers
 * a window scroll listener on mount and removes it on unmount. The button is visually styled (Tailwind)
 * and includes an accessible `aria-label`; it is also hidden when printing.
 */
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

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