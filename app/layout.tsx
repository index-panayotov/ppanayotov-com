import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { userProfile } from "@/data/user-profile"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: `${userProfile.name} - ${userProfile.title}`,
  description: `CV of ${userProfile.name}, ${userProfile.title} with expertise in software engineering and team management`,
}

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
