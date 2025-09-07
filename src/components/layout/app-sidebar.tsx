
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  School,
  GitGraph,
  Library,
  Settings,
  Bot,
  FlaskConical,
  HelpCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { SyncSentaLogo } from "@/components/icons";
import { useRole } from "@/hooks/use-role";

export function AppSidebar() {
  const { role } = useRole();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["teacher", "school_head", "county_officer"] },
    { href: "/dashboard/tools", icon: Bot, label: "Teacher Tools", roles: ["teacher"] },
    { href: "/dashboard/learning-lab", icon: FlaskConical, label: "Learning Lab", roles: ["teacher"] },
    { href: "/dashboard/resources", icon: Library, label: "My Resources", roles: ["teacher"] },
    { href: "/dashboard/reports", icon: GitGraph, label: "Reports", roles: ["school_head", "county_officer"] },
    { href: "/dashboard/schools", icon: School, label: "Schools", roles: ["school_head", "county_officer"] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SyncSentaLogo className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold tracking-tight">SyncSenta</h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Teacher Guide">
                    <Link href="/dashboard/guide">
                        <HelpCircle />
                        <span>Teacher Guide</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
