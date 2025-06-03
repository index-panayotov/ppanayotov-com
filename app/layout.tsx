import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { userProfile } from "@/data/user-profile"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: `${userProfile.name} - ${userProfile.title}`,
  description: `CV of ${userProfile.name}, ${userProfile.title} with expertise in software engineering and team management`,
}

/**
 * Defines the root layout for the application, applying global styles, font, and structure.
 *
 * Renders the provided {@link children} within the main HTML and body elements, setting language and layout classes.
 *
 * @param children - The React nodes to be rendered inside the layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth md:scroll-pt-20">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  )
}
