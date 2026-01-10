'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-[var(--primary-blue)] text-white',
          'hover:bg-[var(--primary-blue-hover)]'
        ),
        secondary: cn(
          'bg-[var(--background-card)] text-[var(--text-primary)]',
          'hover:bg-[var(--background-hover)]',
          'border border-[var(--border-default)]'
        ),
        ghost: cn(
          'text-[var(--text-secondary)]',
          'hover:text-[var(--text-primary)] hover:bg-[var(--background-hover)]'
        ),
        success: 'bg-[var(--primary-green)] text-white hover:opacity-90',
        danger: 'bg-[var(--primary-red)] text-white hover:opacity-90',
      },
      size: {
        sm: 'h-6 px-2 text-xs rounded-full',
        md: 'h-8 px-3 text-sm rounded-full',
        lg: 'h-10 px-4 text-base rounded-full',
        icon: 'h-8 w-8 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

type NativeButtonProps = React.ComponentPropsWithoutRef<'button'>;

export type ButtonProps = NativeButtonProps &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  };

function LoadingSpinner() {
  return (
    <span
      aria-hidden="true"
      className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

const Button = React.forwardRef<React.ElementRef<'button'>, ButtonProps>(
  ({ className, variant, size, isLoading = false, disabled, children, ...props }, ref) => {
    const isDisabled = Boolean(disabled || isLoading);

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
