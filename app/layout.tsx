import type React from "react"
import "./globals.css"
import "../styles/mobile-typography.css"
import { Inter } from "next/font/google"
import { userProfile } from "@/data/user-profile"
import systemSettings from "@/data/system_settings"
import { GoogleTagManager } from '@next/third-parties/google'
import { StructuredData } from "@/components/structured-data"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"
import { ErrorBoundary } from "@/components/error-boundary"
import { PerformanceDashboard } from "@/components/performance-dashboard"

// Optimized font loading with display swap and preload
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
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
  authors: [{ name: userProfile.name }],
  creator: userProfile.name,
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
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest" />
        {/* Mobile viewport optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        {/* iOS specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={systemSettings.pwa.shortName} />
        {/* Theme colors for mobile browsers */}
        <meta name="theme-color" content={systemSettings.pwa.themeColor} />
        <meta name="msapplication-TileColor" content={systemSettings.pwa.themeColor} />
        {/* Resource hints for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      {systemSettings.gtagEnabled && (<GoogleTagManager gtmId={`${systemSettings.gtagCode}`} />)}
      <body className={`${inter.className} font-sans antialiased`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <ServiceWorkerRegistration />
        <PerformanceDashboard />
      </body>
    </html>
  )
}
