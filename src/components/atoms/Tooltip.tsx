'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tooltipVariants = cva(
  'fixed z-[9999] px-2 py-1.5 text-xs font-medium text-white bg-[#1a1b23] border border-[#2a2a38] rounded-md shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-150',
  {
    variants: {
      position: {
        top: '-translate-x-1/2 -translate-y-[calc(100%+4px)]',
        right: 'translate-x-2 -translate-y-1/2',
        'bottom-left': 'translate-y-2',
      },
    },
    defaultVariants: {
      position: 'top',
    },
  }
);

/**
 * CVA VariantProps sometimes includes null/undefined.
 * We explicitly exclude those so internal logic stays type-safe.
 */
type TooltipPosition = Exclude<
  VariantProps<typeof tooltipVariants>['position'],
  null | undefined
>;

export interface TooltipProps extends VariantProps<typeof tooltipVariants> {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  delay?: number;
  disabled?: boolean;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function Tooltip({
  content,
  children,
  position = 'top',
  className,
  containerClassName,
  delay = 200,
  disabled = false,
}: TooltipProps) {
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mounted, setMounted] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [coords, setCoords] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const safePosition: TooltipPosition = (position ?? 'top') as TooltipPosition;

  const calcPosition = React.useCallback((pos: TooltipPosition) => {
    const el = triggerRef.current;
    if (!el) return null;

    const rect = el.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (pos) {
      case 'top':
        top = rect.top;
        left = rect.left + rect.width / 2;
        break;

      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right;
        break;

      case 'bottom-left':
        top = rect.bottom;
        left = rect.left + rect.width;
        break;

      default:
        top = rect.top;
        left = rect.left + rect.width / 2;
    }

    // keep tooltip inside viewport
    const padding = 8;
    left = clamp(left, padding, window.innerWidth - padding);
    top = clamp(top, padding, window.innerHeight - padding);

    return { top, left };
  }, []);

  const updatePosition = React.useCallback(() => {
    const next = calcPosition(safePosition);
    if (next) setCoords(next);
  }, [calcPosition, safePosition]);

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showTooltip = React.useCallback(() => {
    if (disabled) return;

    clearTimer();
    updatePosition();

    timeoutRef.current = setTimeout(() => {
      updatePosition(); // re-calc in case layout shifted
      setIsVisible(true);
    }, delay);
  }, [clearTimer, delay, disabled, updatePosition]);

  const hideTooltip = React.useCallback(() => {
    clearTimer();
    setIsVisible(false);
  }, [clearTimer]);

  // reposition while visible
  React.useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideTooltip();
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKey);
    };
  }, [hideTooltip, isVisible, updatePosition]);

  // cleanup on unmount
  React.useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return (
    <div
      ref={triggerRef}
      className={cn('relative inline-flex', containerClassName)}
      // mouse
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      // keyboard (focus inside children)
      onFocusCapture={showTooltip}
      onBlurCapture={hideTooltip}
      // touch support
      onTouchStart={(e) => {
        e.stopPropagation();
        showTooltip();
      }}
      onTouchEnd={hideTooltip}
      onTouchCancel={hideTooltip}
    >
      {children}

      {mounted && isVisible
        ? createPortal(
            <div
              role="tooltip"
              style={{ top: coords.top, left: coords.left }}
              className={cn(tooltipVariants({ position: safePosition }), 'opacity-100', className)}
            >
              {content}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
