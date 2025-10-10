/**
 * OptimizedImage Component
 *
 * Enhanced Next.js Image wrapper with performance optimizations:
 * - Automatic WebP/AVIF format selection
 * - Loading states and error handling
 * - Blur placeholder support
 * - Responsive sizing
 * - Performance monitoring
 */

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  onLoadingComplete?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  placeholder = 'empty',
  blurDataURL,
  quality = 85,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoadingComplete
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);

  const handleLoad = useCallback(() => {
    const endTime = performance.now();
    setIsLoading(false);
    setLoadTime(endTime);
    onLoadingComplete?.();

    // Track image loading performance
    logger.debug('Image loaded', {
      src,
      loadTime: `${endTime.toFixed(2)}ms`,
      component: 'OptimizedImage'
    });
  }, [src, onLoadingComplete]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    logger.warn('Failed to load image', { src, component: 'OptimizedImage' });
  }, [src]);

  // Error fallback UI
  if (hasError) {
    return (
      <div
        className={`bg-slate-200 flex items-center justify-center text-slate-500 ${className}`}
        style={fill ? {} : { width, height }}
        aria-label={`Failed to load: ${alt}`}
      >
        <div className="text-center p-4">
          <div className="text-lg mb-1">📷</div>
          <div className="text-xs">Image unavailable</div>
        </div>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    priority,
    sizes,
    placeholder,
    quality,
    onLoad: handleLoad,
    onError: handleError,
    className: `transition-opacity duration-300 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    } ${className}`,
    ...(blurDataURL && { blurDataURL }),
    ...(fill
      ? {
          fill: true,
          style: { objectFit, objectPosition }
        }
      : {
          width,
          height
        }
    )
  };

  return (
    <div className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className={`absolute inset-0 bg-slate-200 animate-pulse ${
            fill ? 'w-full h-full' : ''
          }`}
          style={fill ? {} : { width, height }}
          aria-hidden="true"
        >
          <div className="w-full h-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer" />
        </div>
      )}

      {/* Next.js optimized image */}
      <Image {...imageProps} />

      {/* Development performance indicator */}
      {process.env.NODE_ENV === 'development' && loadTime && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {loadTime.toFixed(0)}ms
        </div>
      )}
    </div>
  );
};

/**
 * Profile Image Component - Optimized for CV profile pictures
 */
interface ProfileImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

const PROFILE_SIZES = {
  sm: { width: 64, height: 64 },
  md: { width: 128, height: 128 },
  lg: { width: 200, height: 200 },
  xl: { width: 400, height: 400 }
} as const;

export const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  size = 'lg',
  className = '',
  priority = false
}) => {
  const { width, height } = PROFILE_SIZES[size];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`rounded-full border-4 border-white/20 shadow-2xl ${className}`}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+kXoiKUaV0P4jA="
      sizes={`${width}px`}
      quality={90}
    />
  );
};

export default OptimizedImage;