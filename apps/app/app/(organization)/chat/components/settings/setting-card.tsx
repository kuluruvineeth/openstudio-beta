import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';

export type TSettingCard = {
  children: ReactNode;
  className?: string;
};

export const SettingCard = ({ children, className }: TSettingCard) => {
  return (
    <div className={cn('min-h-12 w-full rounded-lg py-1', className)}>
      {children}
    </div>
  );
};
