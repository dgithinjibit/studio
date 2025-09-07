
"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  Users,
  FileText,
  School,
  User,
  GitGraph,
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

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["teacher", "school_head", "county_officer"] },
    { href: "/dashboard/classes", icon: Users, label: "My Classes", roles: ["teacher"] },
    { href: "/dashboard/curriculum", icon: FileText, label: "Curriculum", roles: ["teacher"] },
    { href: "/dashboard/reports", icon: GitGraph, label: "Reports", roles: ["teacher", "school_head", "county_officer"] },
    { href: "/dashboard/schools", icon: School, label: "Schools", roles: ["school_head", "county_officer"] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const roleName = {
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
      <SidebarFooter>
        <Separator />
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Logout">
                  <Link href="/login">
                    <LogOut />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        <Separator />
         <div className="flex items-center gap-3 p-2">
            <Avatar className="h-10 w-10">
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">{roleName[role]}</span>
                <span className="text-xs text-muted-foreground">user@example.com</span>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
