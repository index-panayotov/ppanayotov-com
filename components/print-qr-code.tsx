"use client"

import { useEffect, useState } from "react"

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