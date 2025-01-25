import { AnalyticsContext } from '@/app/(organization)/minime/components/analytics';
import { fetcher } from '@/helper/utils';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useContext } from 'react';
import Card from './card';

export default function Timeseries() {
  const { interval, basePath, index } = useContext(AnalyticsContext);

  const { data: total, isLoading } = useQuery({
    queryKey: ['analytics', 'total', interval],
    queryFn: () => fetcher(`${basePath}/analytics/total?interval=${interval}`),
  });

  const { data: timeseries, isLoading: isTimeseriesLoading } = useQuery<
    { start: string; value: number }[]
  >({
    queryKey: ['analytics', 'timeseries', interval],
    queryFn: () =>
      fetcher(`${basePath}/analytics/timeseries?interval=${interval}`),
  });

  const formatDate = useCallback(
    (date: Date) => {
      switch (interval) {
        case '1h':
        case '24h':
          return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
          });
        case 'all':
          return date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          });
        case '7d':
          return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });
        default:
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
      }
    },
    [interval]
  );

  return (
    <Card
      title={`${total?.[0].visits} Unique ${index}`}
      loading={isLoading}
      className="h-auto"
    >
      {/* {isTimeseriesLoading ? (
        <div className="h-72 flex justify-center items-center">
          <Icons.spinner className="animate-spin text-gray-1" size={18} />
        </div>
      ) : (
        <AreaChart
          data={
            timeseries?.some((d) => d.value > 0)
              ? timeseries.map((d) => {
                  return {
                    start: formatDate(new Date(d.start)),
                    value: d.value,
                  };
                })
              : []
          }
          index={index}
        />
      )} */}
      <></>
    </Card>
  );
}
