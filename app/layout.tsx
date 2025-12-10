import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { userProfile } from "@/data/user-profile"
import systemSettings from "@/data/system_settings"
import { GoogleTagManager } from '@next/third-parties/google'
import { StructuredData } from "@/components/structured-data"

import { ErrorBoundary } from "@/components/error-boundary"


// Optimized font loading with display optional to prevent CLS from FOUT
const inter = Inter({
  subsets: ["latin"],
  display: 'optional',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-inter'
})

export const metadata = {
  title: `${userProfile.name} - ${userProfile.title}`,
  description: `Professional CV of ${userProfile.name}, an experienced ${userProfile.title} based in ${userProfile.location}. Specializing in software engineering, team management, and delivery excellence.`,
  keywords: [
    userProfile.name,
    userProfile.title,
    "Software Development",
    "Team Management", 
    "Engineering Leadership",
    "Project Delivery",
    "Software Architecture"
  ].join(", "),
  openGraph: {
    title: `${userProfile.name} - ${userProfile.title}`,
    description: `Professional CV of ${userProfile.name}, an experienced ${userProfile.title}`,
    type: 'profile',
    locale: 'en_US',
    siteName: `${userProfile.name} - CV`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
    <html lang="en" className={`scroll-smooth md:scroll-pt-20 ${inter.variable}`}>
      <head>
        <StructuredData />
        {/* DNS prefetch for analytics (fonts handled by next/font at build time) */}
        {systemSettings.gtagEnabled && (
          <>
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          </>
        )}
      </head>
      {systemSettings.gtagEnabled && (<GoogleTagManager gtmId={`${systemSettings.gtagCode}`} />)}
      <body className={`${inter.className} font-sans antialiased`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
