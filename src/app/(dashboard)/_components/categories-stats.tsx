"use client";

import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

import { DateToUTCDate, GetFormatterCurrency } from "@/lib/helpers";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { UserSettings } from "@/generated/prisma/client";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

export const CategoriesStats = ({ userSettings, from, to }: Props) => {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () => fetch(`/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard formatter={formatter} type="income" data={statsQuery.data || []} />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard formatter={formatter} type="expense" data={statsQuery.data || []} />
      </SkeletonWrapper>
    </div>
  );
};

function CategoriesCard({ formatter, type, data }: { formatter: Intl.NumberFormat; type: TransactionType; data: GetCategoriesStatsResponseType }) {
  const filteredData = data.filter((item) => item.type === type);
  const total = filteredData.reduce((acc, item) => acc + (item._sum?.amount || 0), 0);

  return (
    <Card className="h-80 w-full col-span-6 gap-5 mt-3">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-2xl text-center dark:text-foreground  font-bold md:grid-flow-col">{type === "income" ? "Incomes" : "Expenses"} by category</CardTitle>
      </CardHeader>

      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center space-y-3">
            <h2>No data for the selected period</h2>
            <p className="text-sm text-muted-foreground text-center">Try selecting a different period or try adding new {type === "income" ? "incomes" : "expenses"}</p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex flex-col w-full gap-4 p-4">
              {filteredData.map((item) => {
                const amount = item._sum?.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-400">
                        {item.categoryIcon} {item.category}
                        <span className="ml-2 text-xs text-muted-foreground">({percentage.toFixed(0)}%)</span>
                      </span>

                      <span className="text-sm text-gray-400">{formatter.format(amount)}</span>
                    </div>

                    <Progress value={percentage} indicator={type === "income" ? "bg-emerald-500" : "bg-red-500"} />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
