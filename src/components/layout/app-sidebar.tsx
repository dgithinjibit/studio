
"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Bot,
  FlaskConical,
  HelpCircle,
  Library,
  Database,
  Briefcase,
  Users,
  School,
  Wallet,
  BookUser,
  Megaphone,
  TrendingUp
} from "lucide-react";
import { usePathname } from 'next/navigation';
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
import { getServerUser } from "@/lib/auth";
import type { UserRole } from "@/lib/types";
import { useEffect, useState } from "react";

const teacherNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/tools", icon: Bot, label: "Teacher Tools" },
    { href: "/dashboard/learning-lab", icon: FlaskConical, label: "Learning Lab" },
    { href: "/dashboard/reports", icon: Library, label: "My Library" },
    { href: "/dashboard/improvements", icon: TrendingUp, label: "Improvements" },
];

const schoolHeadNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/reports", icon: Megaphone, label: "Announcements" },
    { href: "/dashboard/school-staff", icon: Users, label: "Staff" },
    { href: "/dashboard/school-finance", icon: Wallet, label: "Finance" },
];

const countyOfficerNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/curriculum", icon: Database, label: "Curriculum" },
    { href: "/dashboard/schools", icon: School, label: "Schools" },
    { href: "/dashboard/county-teachers", icon: BookUser, label: "Teachers" },
    { href: "/dashboard/county-comms", icon: Megaphone, label: "Comms" },
    { href: "/dashboard/county-resources", icon: Briefcase, label: "Resources" },
];

export function AppSidebar() {
  const [role, setRole] = useState<UserRole | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // 1. Instant fallback to localStorage for immediate UI rendering in demo mode
    const localRole = localStorage.getItem('userRole') as UserRole | null;
    if (localRole) {
      setRole(localRole);
    }

    // 2. Authoritative check from Server Action
    const fetchRole = async () => {
         const user = await getServerUser();
         if (user?.role) {
           setRole(user.role as UserRole);
           localStorage.setItem('userRole', user.role);
         }
    }
    fetchRole();
  }, []);

  const getNavItems = () => {
    switch (role) {
        case 'teacher':
            return teacherNavItems;
        case 'school_head':
            return schoolHeadNavItems;
        case 'county_officer':
            return countyOfficerNavItems;
        default:
            return []; // Return empty for students or loading state
    }
  };

  const navItems = getNavItems();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex flex-col">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-primary">SyncSenta</h2>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Educational OS</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                asChild 
                tooltip={item.label}
                isActive={pathname === item.href}
                className="transition-all duration-200"
              >
                <Link href={item.href}>
                  <item.icon className={pathname === item.href ? "text-primary" : ""} />
                  <span className={pathname === item.href ? "font-bold" : ""}>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarSeparator className="mb-2" />
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Guide"
                  isActive={pathname === "/dashboard/guide"}
                >
                <Link href="/dashboard/guide">
                    <HelpCircle className={pathname === "/dashboard/guide" ? "text-primary" : ""} />
                    <span className={pathname === "/dashboard/guide" ? "font-bold" : ""}>Guide</span>
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
