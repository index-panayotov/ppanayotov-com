import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Preslav Panayotov - Software Engineering Manager",
  description:
    "Software Engineering Manager with 12+ years of experience in SAFe PI Planning, multi-team delivery, React, Next.js, TypeScript, and cloud infrastructure. Based in Sofia, Bulgaria.",
  keywords: [
    "Software Engineering Manager",
    "Preslav Panayotov",
    "React",
    "Next.js",
    "TypeScript",
    "SAFe",
    "Sofia Bulgaria",
    "Team Leadership",
    "Delivery Management",
  ],
  authors: [{ name: "Preslav Panayotov" }],
  creator: "Preslav Panayotov",
  metadataBase: new URL("https://ppanayotov.com"),
  openGraph: {
    title: "Preslav Panayotov - Software Engineering Manager",
    description:
      "Software Engineering Manager with 12+ years of experience in multi-team delivery, React, Next.js, and cloud infrastructure.",
    url: "https://ppanayotov.com",
    siteName: "Preslav Panayotov",
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Preslav Panayotov - Software Engineering Manager",
    description:
      "Software Engineering Manager based in Sofia, Bulgaria.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
