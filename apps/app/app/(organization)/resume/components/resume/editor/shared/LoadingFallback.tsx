import { cn } from '@repo/design-system/lib/utils';

interface LoadingFallbackProps {
  lines?: number;
  className?: string;
}

export function LoadingFallback({
  lines = 2,
  className,
}: LoadingFallbackProps) {
  return (
    <div className={cn('animate-pulse space-y-4', className)}>
      <div className="h-8 w-1/3 rounded-md bg-muted" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-24 rounded-md bg-muted" />
      ))}
    </div>
  );
}
