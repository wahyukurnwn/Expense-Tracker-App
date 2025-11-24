"use client";

import { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
}

export const SkeletonWrapper = ({ children, isLoading, fullWidth }: Props) => {
  if (isLoading) {
    return (
      <Skeleton className={cn("rounded-md h-10", fullWidth && "w-full")}>
        <div className="opacity-0 pointer-events-none">{children}</div>
      </Skeleton>
    );
  }

  return <>{children}</>;
};
