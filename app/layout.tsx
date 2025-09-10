import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { userProfile } from "@/data/user-profile"
import systemSettings from "@/data/system_settings"
import { GoogleTagManager } from '@next/third-parties/google'
import { StructuredData } from "@/components/structured-data"

const inter = Inter({ subsets: ["latin"] })

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
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  }
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
      <head>
        <StructuredData />
      </head>
      {systemSettings.gtagEnabled && (<GoogleTagManager gtmId={`${systemSettings.gtagCode}`} />)}
      <body className={`${inter.className}`}>{children}</body>
    </html>
  )
}
