import { Navbar } from "@/components/navbar";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen w-full">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
}
