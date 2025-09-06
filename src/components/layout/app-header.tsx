"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRole } from "@/hooks/use-role";
import type { UserRole } from "@/lib/types";

const roles: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'school_head', label: 'School Head' },
    { value: 'county_officer', label: 'County Officer' },
];

export function AppHeader({ title }: { title: string }) {
  const { role, setRole } = useRole();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm hidden sm:inline">Simulate Role:</span>
         <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
                {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
    </header>
  );
}
