"use client"

import { useEffect, useState } from "react"

/**
 * Renders a print-only QR code linking to the current site origin.
 *
 * On the client, this component generates a QR code image URL (via a third-party QR API) for window.location.origin after mount and delays rendering until mounted to avoid hydration mismatches. The output is hidden on screen and displayed only when printing.
 *
 * @returns A JSX element containing the QR image and caption, or `null` until the component has mounted and the QR URL is available.
 */
export function PrintQRCode() {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Generate QR code URL using a free QR code API
    const currentUrl = window.location.origin
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(currentUrl)}`
    setQrCodeUrl(qrApiUrl)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted || !qrCodeUrl) return null

  return (
    <div className="hidden print:flex print:items-center print:justify-end print:mt-4">
      <div className="text-center">
        <img 
          src={qrCodeUrl} 
          alt="QR Code to online CV" 
          className="w-16 h-16 mx-auto mb-1"
        />
        <p className="text-xs text-gray-600">Scan for online version</p>
      </div>
    </div>
  )
}