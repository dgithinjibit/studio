
"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { RoleProvider } from "@/components/providers/role-provider";
import { AppHeader } from "@/components/layout/app-header";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <RoleProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <AppHeader />
             <main className="flex-1 p-4 md:p-6">
                {children}
            </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  );
}
