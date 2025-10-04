"use client"

import Link from "next/link"
import { useEffect } from "react"
// Optimized individual icon imports for better tree-shaking
import { FiPrinter, FiX } from "react-icons/fi"
import { useHorizontalSwipe } from "@/hooks/use-touch-gestures"
import { SystemSettings } from "@/services/SystemSettings"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Mobile-only full-screen navigation menu with touch gesture support.
 *
 * Features:
 * - Swipe left to close the menu
 * - Prevents background scrolling while open
 * - Full-screen overlay with navigation links
 * - Touch-friendly interactive elements
 *
 * @param isOpen - Whether the mobile menu is visible.
 * @param onClose - Callback invoked to close the menu; also called when a navigation link is clicked, swipe gesture, or print action.
 * @returns The menu's JSX when `isOpen` is true, otherwise `null`.
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Touch gesture support for closing menu
  const swipeRef = useHorizontalSwipe(
    onClose, // Swipe left to close
    () => {}, // Swipe right (no action)
    100 // Threshold for swipe detection
  );

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handlePrint = () => {
    onClose()
    window.print()
  }

  if (!isOpen) return null

  return (
    <div
      ref={swipeRef}
      className="fixed inset-0 bg-white z-50 md:hidden"
    >
      <div className="flex flex-col h-full p-6">
        {/* Swipe indicator */}
        <div className="flex justify-center mb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full opacity-50" />
        </div>
        <div className="flex justify-end mb-8">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close menu">
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-2 text-center">
          <Link
            href="#hero"
            className="text-lg font-medium py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-b border-slate-100 rounded-lg min-h-[56px] flex items-center justify-center"
            onClick={onClose}
          >
            Home
          </Link>
          <Link
            href="#summary"
            className="text-lg font-medium py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-b border-slate-100 rounded-lg min-h-[56px] flex items-center justify-center"
            onClick={onClose}
          >
            Summary
          </Link>
          <Link
            href="#experience"
            className="text-lg font-medium py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-b border-slate-100 rounded-lg min-h-[56px] flex items-center justify-center"
            onClick={onClose}
          >
            Experience
          </Link>
          <Link
            href="#skills"
            className="text-lg font-medium py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-b border-slate-100 rounded-lg min-h-[56px] flex items-center justify-center"
            onClick={onClose}
          >
            Skills
          </Link>
          <Link
            href="#languages"
            className="text-lg font-medium py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-b border-slate-100 rounded-lg min-h-[56px] flex items-center justify-center"
            onClick={onClose}
          >
            Languages
          </Link>
          <Link
            href="#education"
            className="text-lg font-medium py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-b border-slate-100 rounded-lg min-h-[56px] flex items-center justify-center"
            onClick={onClose}
          >
            Education
          </Link>
          <Link
            href="#certifications"
            className="text-lg font-medium py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-b border-slate-100 rounded-lg min-h-[56px] flex items-center justify-center"
            onClick={onClose}
          >
            Certifications
          </Link>
          <Link
            href="#contact"
            className="text-lg font-medium py-4 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-b border-slate-100 rounded-lg min-h-[56px] flex items-center justify-center"
            onClick={onClose}
          >
            Contact
          </Link>
          {SystemSettings.get("showPrint") && (
            <button
              onClick={handlePrint}
              className="cv-button-primary mt-6 mx-auto min-h-[56px] px-6"
            >
              <FiPrinter size={18} className="mr-2" />
              Print CV
            </button>
          )}
        </nav>
      </div>
    </div>
  )
}
