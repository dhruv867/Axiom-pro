'use client';

import Image from 'next/image';
import * as React from 'react';
import { cn } from '@/lib/utils';

export type OptimizedImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  unoptimized?: boolean;
};

const ALLOWED_EXTERNAL_DOMAINS = [
  'axiom.trade',
  'pollinations.ai',
  'dicebear.com',
];

function isAllowedExternal(src: string) {
  return ALLOWED_EXTERNAL_DOMAINS.some((domain) => src.includes(domain));
}

function OptimizedImageComponent({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  unoptimized = false,
}: OptimizedImageProps) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const shouldDisableOptimization = React.useMemo(() => {
    if (unoptimized) return true;
    // local images can stay optimized
    if (src.startsWith('/')) return false;
    // external images only optimized if allowed domains
    return !isAllowedExternal(src);
  }, [src, unoptimized]);

  const boxStyle = React.useMemo<React.CSSProperties>(
    () => ({ width, height }),
    [width, height]
  );

  if (hasError) {
    return (
      <div
        className={cn(
          'bg-[#1a1b23] flex items-center justify-center rounded-sm',
          className
        )}
        style={boxStyle}
        aria-label="Image failed to load"
      >
        <span className="text-[10px] text-[#6b6b7a]">!</span>
      </div>
    );
  }

  return (
    <div className="relative" style={boxStyle}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#1a1b23] animate-pulse rounded-sm" />
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        unoptimized={shouldDisableOptimization}
        onLoadingComplete={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </div>
  );
}

export const OptimizedImage = React.memo(OptimizedImageComponent);
