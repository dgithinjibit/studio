
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
  Briefcase,
  Megaphone,
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
    { href: "/dashboard/reports", icon: Library, label: "My Library", roles: ["teacher", "school_head"] },
    { href: "/dashboard/staff", icon: Briefcase, label: "Staff", roles: ["school_head"] },
    { href: "/dashboard/reports", icon: GitGraph, label: "Reports", roles: ["county_officer"] },
    { href: "/dashboard/schools", icon: School, label: "Schools", roles: ["county_officer"] },
  ];

  // A simple role-based filtering logic
  const getFilteredNavItems = () => {
    if (role === 'teacher') {
        return navItems.filter(item => ['Dashboard', 'Teacher Tools', 'Learning Lab', 'My Library'].includes(item.label));
    }
    if (role === 'school_head') {
        return navItems.filter(item => ['Dashboard', 'Staff', 'My Library'].includes(item.label));
    }
     if (role === 'county_officer') {
        return navItems.filter(item => ['Dashboard', 'Reports', 'Schools'].includes(item.label));
    }
    return [];
  }

  const filteredNavItems = getFilteredNavItems();

  const renderGuideLink = () => {
    switch (role) {
      case 'teacher':
        return (
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Teacher Guide">
              <Link href="/dashboard/guide" prefetch={true}>
                <HelpCircle />
                <span>Teacher Guide</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      case 'school_head':
        return (
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="School Head Guide">
              <Link href="/dashboard/school-head-guide" prefetch={true}>
                <HelpCircle />
                <span>School Head Guide</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      default:
        return null;
    }
  };

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
                <Link href={item.href} prefetch={true}>
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
          {renderGuideLink()}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
