"use client";

import { useState } from 'react';
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRole } from "@/hooks/use-role";
import { mockUsers } from "@/lib/mock-data";
import type { User, UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert } from 'lucide-react';

const roles: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'school_head', label: 'School Head' },
    { value: 'county_officer', label: 'County Officer' },
];

export default function UsersPage() {
    const { role: adminRole } = useRole();
    const [users, setUsers] = useState<User[]>(mockUsers);
    const { toast } = useToast();

    const canManage = adminRole === 'school_head' || adminRole === 'county_officer';

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        setUsers(currentUsers => 
            currentUsers.map(user => 
                user.id === userId ? { ...user, role: newRole } : user
            )
        );
    };

    const handleSaveChanges = () => {
        // Here you would typically send the updated users data to your backend
        toast({
            title: "Changes Saved",
            description: "User roles have been updated successfully (simulated).",
        });
    }

    if (!canManage) {
        return (
            <>
                <AppHeader title="User Management" />
                <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
                    <Card className="w-full max-w-md text-center">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2">
                                <ShieldAlert className="w-6 h-6 text-destructive" />
                                Access Denied
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">You do not have permission to manage user roles. This page is restricted to School Heads and County Officers.</p>
                        </CardContent>
                    </Card>
                </main>
            </>
        )
    }

    return (
    <>
      <AppHeader title="User Management" />
      <main className="flex-1 p-4 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>Manage User Roles</CardTitle>
                <CardDescription>Assign roles to users in the system. Changes are only saved when you click "Save Changes".</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead className="hidden sm:table-cell">Email</TableHead>
                            <TableHead>Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {users.map(user => (
                           <TableRow key={user.id}>
                               <TableCell>
                                   <div className="flex items-center gap-3">
                                       <Avatar>
                                           <AvatarImage src={user.avatar} alt={user.name} />
                                           <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                       </Avatar>
                                       <span className="font-medium">{user.name}</span>
                                   </div>
                               </TableCell>
                               <TableCell className="hidden sm:table-cell text-muted-foreground">{user.email}</TableCell>
                               <TableCell>
                                    <Select 
                                        defaultValue={user.role} 
                                        onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(r => (
                                                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                               </TableCell>
                           </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
        </Card>
      </main>
    </>
  );
}
