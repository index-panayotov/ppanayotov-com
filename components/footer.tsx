"use client";

import type { FooterProps } from "@/types";

export function Footer({ profileData, selectedTemplate }: FooterProps) {
  switch (selectedTemplate) {
    case "modern":
      return (
        <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl py-8 mt-16">
          <div className="container mx-auto max-w-6xl px-4 text-center text-slate-400">
            <p className="font-medium">
              © {new Date().getFullYear()} {profileData.name}. Crafted with passion.
            </p>
          </div>
        </footer>
      );
    case "professional":
      return (
        <footer className="bg-slate-100 py-6 mt-12">
          <div className="container mx-auto max-w-4xl px-4 text-center text-slate-600 text-sm">
            <p>© {new Date().getFullYear()} {profileData.name}. All rights reserved.</p>
          </div>
        </footer>
      );
    case "classic":
    default:
      return (
        <footer className="bg-slate-900 text-slate-300 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">© {new Date().getFullYear()} {profileData.name}. All rights reserved.</p>
            <p className="text-xs text-slate-400 mt-2">
              Powered by{" "}
              <a
                href="https://github.com/index-panayotov/ppanayotov-com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ppanayotov-com
              </a>
            </p>
          </div>
        </footer>
      );
  }
}
