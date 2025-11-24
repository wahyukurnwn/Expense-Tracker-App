import { Logo } from "@/components/logo";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen">
      <Logo />
      <div className="mt-6">{children}</div>
    </div>
  );
}
