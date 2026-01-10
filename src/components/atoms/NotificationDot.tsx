'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type NotificationDotProps = {
  children: React.ReactNode;
  className?: string;
  dotClassName?: string;
};

export const NotificationDot = React.memo(function NotificationDot({
  children,
  className,
  dotClassName,
}: NotificationDotProps) {
  return (
    <span className={cn('relative inline-flex', className)}>
      {children}
      <span
        aria-hidden="true"
        className={cn(
          'absolute -top-0.5 right-0 h-[4px] w-[4px] rounded-full bg-[#ec397a]',
          dotClassName
        )}
      />
    </span>
  );
});
