import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return <div className="relative flex flex-col items-center justify-center h-screen w-full">{children}</div>;
}
