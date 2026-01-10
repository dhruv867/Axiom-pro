'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type MetricBlockProps = {
  icon: React.ReactNode;
  text: string | number;
  color?: string;
  textClass?: string;
  className?: string;
};

export function MetricBlock({
  icon,
  text,
  color = '#777a8c',
  textClass = 'text-[#fcfcfc]',
  className,
}: MetricBlockProps) {
  return (
    <span className={cn('flex items-center gap-1', className)} title={String(text)}>
      <span style={{ color }} aria-hidden="true">
        {icon}
      </span>

      <span className={cn(textClass)}>{text}</span>
    </span>
  );
}
