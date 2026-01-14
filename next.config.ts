import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Vercel deployment
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
