
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  Users,
  FileText,
  School,
  GitGraph,
  Library,
  Settings,
  Bot,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SyncSentaLogo } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRole } from "@/hooks/use-role";

export function AppSidebar() {
  const { role } = useRole();
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
  }, [role]); // Rerun if role changes, just in case

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["teacher", "school_head", "county_officer"] },
    { href: "/dashboard/tools", icon: Bot, label: "Teacher Tools", roles: ["teacher"] },
    { href: "/dashboard/resources", icon: Library, label: "My Resources", roles: ["teacher"] },
    { href: "/dashboard/reports", icon: GitGraph, label: "Reports", roles: ["school_head", "county_officer"] },
    { href: "/dashboard/schools", icon: School, label: "Schools", roles: ["school_head", "county_officer"] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const roleName: { [key: string]: string } = {
    teacher: "Teacher",
    school_head: "School Head",
    county_officer: "County Officer",
    student: "Student"
  }


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
    </Sidebar>
  );
}
