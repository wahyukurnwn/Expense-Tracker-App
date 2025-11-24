"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";

import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { StatsCards } from "./stats-cards";
import { CategoriesStats } from "./categories-stats";

import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { UserSettings } from "@/generated/prisma/client";

export const Overview = ({ userSettings }: { userSettings: UserSettings }) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <div className="container flex flex-wrap items-end justify-between gap-2 p-6 mt-3">
      <h2 className="text-3xl font-bold">Overview</h2>
      <div className="flex items-center gap-3">
        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={(values) => {
            const { from, to } = values.range;

            if (!from || !to) return;

            if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
              toast.error(`The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`);
              return;
            }

            setDateRange({ from, to });
          }}
        />
      </div>
      <div className="container flex w-full flex-col gap-5">
        <StatsCards userSettings={userSettings} from={dateRange.from} to={dateRange.to} />

        <CategoriesStats userSettings={userSettings} from={dateRange.from} to={dateRange.to} />
      </div>
    </div>
  );
};
