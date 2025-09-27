
import Link from "next/link";
import {
  LayoutDashboard,
  Bot,
  FlaskConical,
  HelpCircle,
  Library,
  Database,
  Users,
  Banknote,
  Megaphone,
  Building2,
  Package,
  Palette
} from "lucide-react";
import { cookies } from 'next/headers';
import type { UserRole } from "@/lib/types";

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
import { SyncSentaLogo } from "../icons";

export function AppSidebar() {
  const cookieStore = cookies();
  const role = cookieStore.get('userRole')?.value as UserRole | undefined;

  const teacherNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/tools", icon: Bot, label: "Teacher Tools" },
    { href: "/dashboard/learning-lab", icon: FlaskConical, label: "Learning Lab" },
    { href: "/dashboard/reports", icon: Library, label: "My Library" },
    { href: "/dashboard/curriculum", icon: Database, label: "Curriculum" },
    { href: "/dashboard/creative-arts", icon: Palette, label: "Creative Arts" },
  ];
  
  const schoolHeadNavItems = [
       { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
       { href: "/dashboard/reports", icon: Library, label: "School Reports" },
       { href: "/dashboard/school-staff", icon: Users, label: "Staff Management" },
       { href: "/dashboard/school-finance", icon: Banknote, label: "School Finance" },
  ];

  const countyAdminNavItems = [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/dashboard/schools", icon: Building2, label: "Schools" },
      { href: "/dashboard/county-resources", icon: Package, label: "Resource Management" },
      { href: "/dashboard/county-teachers", icon: Users, label: "Teacher Management" },
      { href: "/dashboard/county-finance", icon: Banknote, label: "Financial Oversight" },
      { href: "/dashboard/county-comms", icon: Megaphone, label: "Communications" },
  ];

  let navItems;

  switch (role) {
    case 'teacher':
      navItems = teacherNavItems;
      break;
    case 'school_head':
      navItems = schoolHeadNavItems;
      break;
    case 'county_officer':
      navItems = countyAdminNavItems;
      break;
    default:
      // A safe default for when the role isn't determined yet.
      // This prevents errors during the initial render before the cookie is read.
      navItems = [{ href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }];
      break;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SyncSentaLogo className="w-8 h-8" />
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold tracking-tight">EduCloud</h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
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
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Guide">
                <Link href="/dashboard/guide" prefetch={true}>
                    <HelpCircle />
                    <span>Guide</span>
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
