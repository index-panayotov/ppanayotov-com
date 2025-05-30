import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Preslav Panayotov - Software Delivery Manager",
  description:
    "CV of Preslav Panayotov, Software Delivery Manager with expertise in software engineering and team management",
    generator: 'v0.dev'
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
