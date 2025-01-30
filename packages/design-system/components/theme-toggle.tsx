'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Icons } from '@repo/design-system/components/ui/icons';
import { cn } from '@repo/design-system/lib/utils';
import { useTheme } from 'next-themes';

export default function ThemeToggle({
  compact = false,
  onlyText = false,
  className,
  iconSize = 15,
}: {
  compact?: boolean;
  onlyText?: boolean;
  className?: string;
  iconSize?: number;
}) {
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';
  const toggle = () => setTheme(isDark ? 'light' : 'dark');
  const text = isDark ? 'Switch to light' : 'Switch to dark';
  if (onlyText) {
    return (
      <p
        onClick={toggle}
        className="w-max cursor-pointer text-gray-4 text-xs transition-colors"
      >
        {text}
      </p>
    );
  }

  return (
    <Button
      onClick={toggle}
      className={cn(
        'w-full justify-start gap-2 dark:[&_.moon-icon]:hidden [&_.sun-icon]:hidden dark:[&_.sun-icon]:inline',
        compact ? 'justify-center text-gray-4' : '',
        className
      )}
      size={compact ? 'icon' : 'sm'}
      variant="ghost"
      aria-label={text}
    >
      <Icons.sun size={iconSize} className="sun-icon" />
      <Icons.moon size={iconSize} className="moon-icon" />
      {!compact && <span className="text-xs ">{text}</span>}
    </Button>
  );
}
