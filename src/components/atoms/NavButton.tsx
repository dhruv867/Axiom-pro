'use client';

import * as React from 'react';
import { NotificationDot } from './NotificationDot';
import { cn } from '@/lib/utils';

export interface NavButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: React.ReactNode;
  label?: string;
  withDot?: boolean;
}

export const NavButton = React.memo(function NavButton({
  icon,
  label,
  className,
  withDot = false,
  type = 'button',
  disabled,
  ...props
}: NavButtonProps) {
  const button = (
    <button
      type={type}
      disabled={disabled}
      aria-label={label ?? 'Navigation button'}
      className={cn(
        'flex items-center gap-[3px] bg-none border-none cursor-pointer text-[10px] text-[#6b6b7a]',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {icon}

      {label ? (
        <span className="text-[#fcfcfcfc]">{label}</span>
      ) : null}
    </button>
  );

  return withDot ? <NotificationDot>{button}</NotificationDot> : button;
});
