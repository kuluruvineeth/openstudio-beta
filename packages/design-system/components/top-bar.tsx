import { cn } from '@repo/design-system/lib/utils';
import type React from 'react';

interface TopBarProps {
  children: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export function TopBar({ children, className, sticky = false }: TopBarProps) {
  return (
    <div
      className={cn(
        'justify-between border-border border-b bg-background px-2 py-2 shadow sm:flex sm:px-4',
        sticky && 'top-0 z-10 sm:sticky',
        className
      )}
    >
      {children}
    </div>
  );
}
