'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;

  /** default: bottom */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** default: end */
  align?: 'start' | 'center' | 'end';
  offset?: number;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function Popover({
  trigger,
  children,
  className,
  contentClassName,
  side = 'bottom',
  align = 'end',
  offset = 8,
}: PopoverProps) {
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => setMounted(true), []);

  const updatePosition = React.useCallback(() => {
    const t = triggerRef.current;
    const c = contentRef.current;
    if (!t || !c) return;

    const tr = t.getBoundingClientRect();
    const cr = c.getBoundingClientRect();

    let top = 0;
    let left = 0;

    // side positioning
    if (side === 'bottom') top = tr.bottom + offset;
    if (side === 'top') top = tr.top - cr.height - offset;
    if (side === 'right') left = tr.right + offset;
    if (side === 'left') left = tr.left - cr.width - offset;

    // align positioning
    if (side === 'top' || side === 'bottom') {
      if (align === 'start') left = tr.left;
      if (align === 'center') left = tr.left + tr.width / 2 - cr.width / 2;
      if (align === 'end') left = tr.right - cr.width;
    } else {
      if (align === 'start') top = tr.top;
      if (align === 'center') top = tr.top + tr.height / 2 - cr.height / 2;
      if (align === 'end') top = tr.bottom - cr.height;
    }

    // keep inside viewport
    const pad = 8;
    left = clamp(left, pad, window.innerWidth - cr.width - pad);
    top = clamp(top, pad, window.innerHeight - cr.height - pad);

    setPos({ top, left });
  }, [align, offset, side]);

  React.useEffect(() => {
    if (!open) return;

    updatePosition();

    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDocClick = (e: MouseEvent) => {
      const t = triggerRef.current;
      const c = contentRef.current;
      if (!t || !c) return;

      const target = e.target as Node;
      if (!t.contains(target) && !c.contains(target)) setOpen(false);
    };

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, updatePosition]);

  return (
    <div className={cn('inline-flex', className)}>
      <div
        ref={triggerRef}
        className="inline-flex"
        onClick={() => setOpen((v) => !v)}
      >
        {trigger}
      </div>

      {mounted && open
        ? createPortal(
            <div
              ref={contentRef}
              style={{ top: pos.top, left: pos.left }}
              className={cn(
                'fixed z-[9999] rounded-xl border border-white/10 bg-[#0b0b0f] p-2 shadow-xl',
                'min-w-[180px]',
                contentClassName
              )}
            >
              {children}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
