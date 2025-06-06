import Favicon from '@/app/(organization)/minime/components/bookmarks/bookmark-favicon';
import { EmptyPlaceholder } from '@repo/design-system/components/ui/empty-placeholder';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { cn } from '@repo/design-system/lib/utils';
import type { JSX } from 'react';
import ViewAllBarlist from './view-all-barlist';

export type Bar = {
  name: string;
  value: number;
  href?: string;
  icon?: any;
};

interface Props {
  data?: Bar[];
  title: string;
  loading?: boolean;
}

export default function BarList({ data, title, loading }: Props) {
  return (
    <div
      className={cn(
        'relative w-full flex-1',
        data && data?.length > 2 ? 'overflow-hidden' : ''
      )}
    >
      <div className="flex flex-col p-2">
        {loading && (
          <div className="flex flex-col gap-2">
            {[...new Array(3).fill(true)].map((_, i) => (
              <Skeleton className={cn('h-4.5')} key={i} />
            ))}
          </div>
        )}

        <div className="flex flex-1 flex-col gap-2 ">
          {!loading &&
            data?.map((item) => (
              <BarListItem item={item} key={item.name} total={data[0].value} />
            ))}
        </div>

        {!data?.length && !loading && (
          <EmptyPlaceholder className="min-h-max border-0 text-gray-4">
            <EmptyPlaceholder.Title className="text-sm">
              No data yet
            </EmptyPlaceholder.Title>
          </EmptyPlaceholder>
        )}
      </div>
      {data && data.length > 2 && <ViewAllBarlist title={title} data={data} />}
    </div>
  );
}

export const BarListItem = ({
  item,
  total,
  className,
}: {
  item: Bar;
  total: number;
  className?: string;
}) => {
  return (
    <Comp
      as={item.href ? 'Link' : 'div'}
      href={item.href}
      target="_blank"
      className={cn(
        'relative flex h-4.5 min-h-[30px] w-full items-center justify-between overflow-hidden rounded-md px-2 py-1 transition-colors hover:bg-gray-3',
        className
      )}
    >
      <div className="flex flex-1 items-center gap-2">
        <span
          style={{
            width: `${(item.value / total) * 100}%`,
          }}
          className="absolute top-0 left-0 z-[1] h-full rounded-md bg-[#8d8d8d21]"
        />
        {item.icon && (
          <Favicon url={item.icon} alt={`${item.icon} icon`} size={18} />
        )}
        <div className="truncate text-sm">{item.name}</div>
      </div>

      <span>{item.value}</span>
    </Comp>
  );
};

function Comp({
  as,
  children,
  ...props
}: {
  [key: string]: any;
  as: any;
  children?: React.ReactNode;
}): JSX.Element {
  const Component = as;
  return <Component {...props}>{children}</Component>;
}
