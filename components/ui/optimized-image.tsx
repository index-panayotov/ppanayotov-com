'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * OptimizedImage Component
 *
 * Provides automatic image optimization with Next.js Image component:
 * - WebP/AVIF format conversion
 * - Responsive sizing
 * - Lazy loading
 * - Performance monitoring
 * - Error handling with fallbacks
 */

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoadingComplete?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/api/placeholder/400/300',
  className,
  containerClassName,
  priority = false,
  quality = 85,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoadingComplete,
  onError,
  ...props
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);

    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    }

    onError?.();
  };

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Optimized image */}
      <Image
        src={currentSrc}
        alt={alt}
        quality={quality}
        priority={priority}
        sizes={sizes}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'filter grayscale',
          className
        )}
        onLoad={handleLoadingComplete}
        onError={handleError}
        {...props}
      />

      {/* Error indicator */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-500">
          <div className="text-center">
            <div className="text-sm">Image unavailable</div>
            <div className="text-xs text-slate-400">Showing fallback</div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Responsive image with automatic sizing based on container
 */
export function ResponsiveImage({
  src,
  alt,
  className,
  aspectRatio = 'aspect-square',
  ...props
}: OptimizedImageProps & {
  aspectRatio?: 'aspect-square' | 'aspect-video' | 'aspect-[4/3]' | 'aspect-[3/2]' | string;
}) {
  return (
    <div className={cn('relative w-full', aspectRatio)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className={cn('object-cover', className)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
    </div>
  );
}

/**
 * Avatar image with circular cropping and optimized sizing
 */
export function AvatarImage({
  src,
  alt,
  size = 'md',
  className,
  ...props
}: OptimizedImageProps & {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}) {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20',
  };

  return (
    <div className={cn('relative rounded-full overflow-hidden', sizeClasses[size])}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className={cn('object-cover', className)}
        sizes="(max-width: 768px) 10vw, 5vw"
        quality={90}
        {...props}
      />
    </div>
  );
}

/**
 * Gallery image with zoom and lightbox support
 */
export function GalleryImage({
  src,
  alt,
  thumbnail,
  className,
  onZoom,
  ...props
}: OptimizedImageProps & {
  thumbnail?: string;
  onZoom?: () => void;
}) {
  return (
    <div
      className={cn(
        'relative cursor-pointer group overflow-hidden rounded-lg',
        'hover:shadow-lg transition-all duration-300',
        className
      )}
      onClick={onZoom}
    >
      <OptimizedImage
        src={thumbnail || src}
        alt={alt}
        className="group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        {...props}
      />

      {/* Zoom overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hero image with optimized loading for above-the-fold content
 */
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={true}
      quality={95}
      className={cn('object-cover', className)}
      sizes="100vw"
      {...props}
    />
  );
}

export default OptimizedImage;