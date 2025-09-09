
import type { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return <div className="bg-stone-100">{children}</div>;
}
