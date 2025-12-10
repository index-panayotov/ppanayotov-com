'use client';

import Link from "next/link";
import { useState, useCallback } from "react";
import { Mail, Linkedin, Menu, X, Phone, MapPin } from "lucide-react";
import { MobileMenu } from "@/components/mobile-menu";
import { getSocialIcon } from "@/lib/social-platforms";
import type { BlogHeaderProps } from "@/types";

export function BlogHeader({
  profileData,
  systemSettings,
  selectedTemplate,
}: BlogHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getSocialIconForDisplay = useCallback((platform: string) => {
    return getSocialIcon(platform, "h-5 w-5");
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  switch (selectedTemplate) {
    case "classic":
      return (
        <header className="px-4 py-6 md:sticky md:top-0 md:z-50 md:bg-white/80 md:backdrop-blur-md md:shadow-sm md:border-b md:border-slate-200/50" role="banner">
          <div className="container mx-auto">
            <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-slate-800">
                  {profileData.name}
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
                <Link href="/" className="cv-nav-link">Home</Link>
                <Link href="/#summary" className="cv-nav-link">Summary</Link>
                <Link href="/#experience" className="cv-nav-link">Experience</Link>
                <Link href="/#skills" className="cv-nav-link">Skills</Link>
                <Link href="/#education" className="cv-nav-link">Education</Link>
                <Link href="/#certifications" className="cv-nav-link">Certifications</Link>
                {systemSettings.blogEnable && (
                  <Link href="/blog" className="cv-nav-link">Blog</Link>
                )}
                {systemSettings.showContacts && (
                  <Link href="/#contact" className="cv-nav-link">Contact</Link>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  className="cv-button-secondary md:hidden"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </nav>
          </div>
          {mobileMenuOpen && <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />} 
        </header>
      );
    case "professional":
      return (
        <header className="bg-slate-800 text-white py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{profileData.name}</h1>
                </Link>
                <h2 className="text-xl md:text-2xl text-slate-300 mb-4">{profileData.title}</h2>
                <div className="flex flex-wrap gap-4 text-slate-300 text-sm">
                  {profileData.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                  {profileData.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              {profileData.socialLinks && profileData.socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {profileData.socialLinks
                    .filter(link => link.visible)
                    .slice(0, 4)
                    .map((link, index) => (
                      <a
                        key={index}
                        href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                        aria-label={link.platform}
                      >
                        {getSocialIcon(link.platform, "w-5 h-5")}
                      </a>
                    ))}
                </div>
              )}
            </div>
          </div>
        </header>
      );
    case "modern":
      return (
        <header className="relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />

          <div className="relative container mx-auto max-w-6xl px-4 py-20 md:py-32">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex-1">
                <div className="inline-block px-4 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-bold rounded-full mb-4">
                  AVAILABLE FOR HIRE
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {profileData.name}
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold text-slate-300 mb-6">{profileData.title}</h2>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-6">
                  {profileData.location && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.email && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
                      <Mail className="w-4 h-4 text-purple-400" />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                  {profileData.phone && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10">
                      <Phone className="w-4 h-4 text-pink-400" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links - Modern cards */}
              {profileData.socialLinks && profileData.socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {profileData.socialLinks
                    .filter(link => link.visible)
                    .slice(0, 5)
                    .map((link, index) => (
                      <a
                        key={index}
                        href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:scale-110"
                        aria-label={link.platform}
                      >
                        {getSocialIcon(link.platform, "w-6 h-6 group-hover:text-cyan-400 transition-colors")}
                      </a>
                    ))}
                </div>
              )}
            </div>
          </div>
        </header>
      );
    default:
      return null;
  }
}
