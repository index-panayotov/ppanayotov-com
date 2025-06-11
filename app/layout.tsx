import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { userProfile } from "@/data/user-profile"
import systemSettings from "@/data/system_settings"
import { GoogleTagManager } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: `${userProfile.name} - ${userProfile.title}`,
  description: `CV of ${userProfile.name}, ${userProfile.title} with expertise in software engineering and team management`,
}

/**
 * Root layout component that wraps all pages with global styles and font.
 *
 * Renders the application's HTML structure, applies the Inter font, and ensures consistent layout and styling for all child components.
 *
 * @param children - The content to be rendered within the layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth md:scroll-pt-20">
      {systemSettings.gtagEnabled && (<GoogleTagManager gtmId={`${systemSettings.gtagCode}`} />)}
      <body className={`${inter.className}`}>{children}</body>
    </html>
  )
}
