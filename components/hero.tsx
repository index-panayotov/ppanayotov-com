"use client";

import Image from "next/image";
import { profile } from "@/data/profile";
import { Mail, MapPin, Linkedin, ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="gradient-hero min-h-screen flex items-center justify-center relative">
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Profile Photo */}
          <div className="mb-8">
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
              <Image
                src="/images/profile.webp"
                alt={profile.name}
                fill
                className="rounded-full object-cover border-4 border-white/20 shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Name */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            {profile.name}
          </h1>

          {/* Title */}
          <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 mb-8 font-light">
            {profile.title}
          </p>

          {/* Summary */}
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            {profile.summary}
          </p>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-5 h-5" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-5 h-5" />
              <span>{profile.email}</span>
            </div>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>

          {/* CTA Button */}
          <a
            href="#experience"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-100 transition-all hover:scale-105"
          >
            View My Experience
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-slate-400" />
      </div>
    </section>
  );
}
