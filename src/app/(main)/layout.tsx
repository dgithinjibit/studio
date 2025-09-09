
"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { useRole } from "@/hooks/use-role";
import Link from "next/link";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { role } = useRole();

  if (role === 'student') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
          <AppHeader />
           <main className="p-4 md:p-6 flex-grow">
              {children}
          </main>
          <footer className="mt-auto p-4 text-center text-xs text-muted-foreground">
            @ 2025 dantedone. All rights reserved. | <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
          </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
