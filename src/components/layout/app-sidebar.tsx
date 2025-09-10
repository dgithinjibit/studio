
"use client";

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
import { useRole } from "@/hooks/use-role";

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
import Image from "next/image";

export function AppSidebar() {
  const { role } = useRole();

  const teacherNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/tools", icon: Bot, label: "Teacher Tools" },
    { href: "/dashboard/learning-lab", icon: FlaskConical, label: "Learning Lab" },
    { href: "/dashboard/reports", icon: Library, label: "My Library" },
    { href: "/dashboard/curriculum", icon: Database, label: "Curriculum" },
    { href: "/dashboard/creative-arts", icon: Palette, label: "Creative Arts" },
  ];
  
  const countyAdminNavItems = [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/dashboard/schools", icon: Building2, label: "Schools" },
      { href: "/dashboard/county-resources", icon: Package, label: "Resource Management" },
      { href: "/dashboard/county-teachers", icon: Users, label: "Teacher Management" },
      { href: "/dashboard/county-finance", icon: Banknote, label: "Financial Oversight" },
      { href: "/dashboard/county-comms", icon: Megaphone, label: "Communications" },
  ]
  
  const schoolHeadNavItems = [
       { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
       { href: "/dashboard/reports", icon: Library, label: "School Reports" },
       { href: "/dashboard/school-staff", icon: Users, label: "Staff Management" },
       { href: "/dashboard/school-finance", icon: Banknote, label: "School Finance" },
  ]

  const getNavItems = () => {
    switch (role) {
        case 'county_officer':
            return countyAdminNavItems;
        case 'school_head':
            return schoolHeadNavItems;
        case 'teacher':
        default:
            return teacherNavItems;
    }
  }

  const navItems = getNavItems();


  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src="/sync.png" alt="SyncSenta Logo" width={32} height={32} />
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold tracking-tight">SyncSenta</h2>
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
                <SidebarMenuButton asChild tooltip="Teacher Guide">
                <Link href="/dashboard/guide" prefetch={true}>
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
