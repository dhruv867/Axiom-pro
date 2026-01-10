'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { NotificationDot } from './NotificationDot';

export type NavButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  icon: React.ReactNode;
  label?: string;
  withDot?: boolean;
};

const NavButtonBase = React.forwardRef<HTMLButtonElement, NavButtonProps>(
  (
    {
      icon,
      label,
      className,
      withDot = false,
      type = 'button',
      disabled,
      ...props
    },
    ref
  ) => {
    const content = (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-disabled={disabled ?? false}
        aria-label={label ?? 'Navigation button'}
        className={cn(
          'flex items-center gap-[3px] bg-transparent border-none cursor-pointer text-[10px] text-[#6b6b7a]',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {icon}
        {label ? <span className="text-[#fcfcfc]">{label}</span> : null}
      </button>
    );

    if (!withDot) return content;

    return <NotificationDot>{content}</NotificationDot>;
  }
);

NavButtonBase.displayName = 'NavButton';

export const NavButton = React.memo(NavButtonBase);
