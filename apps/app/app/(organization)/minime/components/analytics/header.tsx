import {
  AnalyticsContext,
  type Interval,
} from '@/app/(organization)/minime/components/analytics';
import AppHeader from '@/app/(organization)/minime/components/layout/app-header';
import ExportButton from '@/components/forms/export-button';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Icons } from '@repo/design-system/components/ui/icons';
import { cn } from '@repo/design-system/lib/utils';
import { INTERVALS } from '@repo/tinybird/src/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';

export default function StatsHeader({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  const { interval } = useContext(AnalyticsContext);
  const router = useRouter();
  const pathname = usePathname();
  return (
    <AppHeader className={cn('mb-2', className)}>
      <div className="flex items-center gap-2">
        {pathname !== '/analytics' && (
          <Button size="icon" onClick={() => router.back()}>
            <Icons.arrowLeft size={16} />
          </Button>
        )}
        <h3 className="title font-medium text-lg">{title}</h3>
      </div>
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="data-[state=open]:bg-gray-2 data-[state=open]:text-secondary "
            >
              <Icons.date size={16} />{' '}
              {INTERVALS.find((i) => i.value === interval)?.display}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {INTERVALS.map((val, i) => (
              <DropdownMenuItem
                className={cn(
                  'h-4.5 text-xs',
                  val.value === interval ? 'bg-gray-2' : ''
                )}
                key={i}
                onClick={() => router.push(`?interval=${val.value}`)}
              >
                {val.display}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <More interval={interval} />
      </div>
    </AppHeader>
  );
}

function More({ interval }: { interval?: Interval }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="data-[state=open]:bg-gray-2 data-[state=open]:text-secondary "
        >
          <Icons.more size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ExportButton
          text="Export analytics as CSV"
          buttonVariant="ghost"
          endpoint={`analytics/export${interval ? `?interval=${interval}` : ''}`}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
