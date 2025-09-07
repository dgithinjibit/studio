
"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { RoleProvider } from "@/components/providers/role-provider";
import { AppHeader } from "@/components/layout/app-header";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
          <AppHeader />
           <main className="p-4 md:p-6">
              {children}
          </main>
          <footer className="mt-auto p-4 text-center text-xs text-muted-foreground">
            by @dantedone
          </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
