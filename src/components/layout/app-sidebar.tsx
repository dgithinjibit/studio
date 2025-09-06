import Link from "next/link";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUsers } from "@/lib/mock-data";


const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/curriculum", icon: BookOpen, label: "Curriculum" },
  { href: "/assignments", icon: FileText, label: "Assignments" },
  { href: "/reports", icon: BarChart3, label: "Reports" },
  { href: "/users", icon: Users, label: "User Management" },
];

export function AppSidebar() {
  const user = mockUsers.find(u => u.role === 'school_head');

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
          {navItems.map((item) => (
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
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
