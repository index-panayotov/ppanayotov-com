import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Preslav Panayotov | Software Delivery Manager",
  description:
    "Software Delivery Manager with over 10 years of experience in the IT industry. Expert in software development, project execution, and engineering team leadership.",
  keywords: [
    "Software Delivery Manager",
    "Engineering Manager",
    "Software Development",
    "Team Leadership",
    "Agile",
    "Scrum",
    "Sofia",
    "Bulgaria",
  ],
  authors: [{ name: "Preslav Panayotov" }],
  creator: "Preslav Panayotov",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ppanayotov.com",
    siteName: "Preslav Panayotov Portfolio",
    title: "Preslav Panayotov | Software Delivery Manager",
    description:
      "Software Delivery Manager with over 10 years of experience in the IT industry.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Preslav Panayotov | Software Delivery Manager",
    description:
      "Software Delivery Manager with over 10 years of experience in the IT industry.",
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
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
