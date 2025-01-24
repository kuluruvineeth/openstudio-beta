"use client";

import type { IntervalProps, intervalData } from "@repo/tinybird/src/utils";
import { useSearchParams } from "next/navigation";
import { createContext } from "react";
import Devices from "@/app/(organization)/minime/components/analytics/devices";
import StatsHeader from "@/app/(organization)/minime/components/analytics/header";
import Locations from "@/app/(organization)/minime/components/analytics/locations";
import Referrers from "@/app/(organization)/minime/components/analytics/referer";
import Timeseries from "@/app/(organization)/minime/components/analytics/timeseries";
import Pages from "@/app/(organization)/minime/components/analytics/top-pages";

export type IndexProps = "visitors" | "views" | "clicks";
export type Interval = keyof typeof intervalData;

export const AnalyticsContext = createContext<{
  basePath: string;
  interval: Interval;
  index?: IndexProps;
}>({
  basePath: "",
  interval: "7d",
  index: "visitors",
});

export default function Analytics({
  basePath,
  pages,
  title,
  index = "visitors",
  headerClassname,
}: {
  basePath: string;
  pages?: boolean;
  title?: string;
  index?: IndexProps;
  headerClassname?: string;
}) {
  const searchParams = useSearchParams();
  const interval = (searchParams?.get("interval") as IntervalProps) || "7d";

  return (
    <AnalyticsContext.Provider
      value={{
        basePath,
        interval,
        index,
      }}
    >
      <div>
        <StatsHeader title={title} className={headerClassname} />
        <Timeseries />
        <div className="relative mt-2 grid grid-cols-2 gap-2 max-md:grid-cols-1">
          {/* {pages && <Pages />}
          <Locations />
          <Devices />
          <Referrers className={!pages ? "col-span-2 max-md:col-span-1" : ""} /> */}
        </div>
      </div>
    </AnalyticsContext.Provider>
  );
}
