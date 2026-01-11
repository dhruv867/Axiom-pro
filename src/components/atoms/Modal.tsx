'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onOpenChange, title, children, className }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />

      {/* Content */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute left-1/2 top-1/2 w-[95vw] max-w-[680px] -translate-x-1/2 -translate-y-1/2',
          'rounded-2xl border border-white/10 bg-[#0b0b0f] shadow-xl',
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-semibold text-white">{title ?? 'Details'}</div>
          <button
            type="button"
            className="rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 text-white/90">{children}</div>
      </div>
    </div>,
    document.body
  );
}
