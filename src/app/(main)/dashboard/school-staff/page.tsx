
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, UserCheck, UserCog } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { AddTeacherDialog } from '@/components/add-teacher-dialog';

const mockTeachingStaff = [
    { id: 't-1', name: 'Ms. Chidinma Okoro', tscNo: 'TSC-12345', role: 'English/Literature' },
    { id: 't-2', name: 'Mr. David Mwangi', tscNo: 'TSC-67890', role: 'Mathematics' },
    { id: 't-3', name: 'Mrs. Fatuma Ali', tscNo: 'TSC-54321', role: 'Kiswahili/CRE' },
];

const mockNonTeachingStaff = [
    { id: 'nt-1', name: 'Mr. James Ochieng', role: 'Bursar' },
    { id: 'nt-2', name: 'Mrs. Alice Wambui', role: 'Secretary' },
    { id: 'nt-3', name: 'Mr. Peter Kamau', role: 'Groundsman' },
];

export default function SchoolStaffPage() {
    const [teachingStaff, setTeachingStaff] = useState(mockTeachingStaff);
    const [nonTeachingStaff, setNonTeachingStaff] = useState(mockNonTeachingStaff);
    const [isAddTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);

    const handleAddTeacher = (teacher: { name: string; role: string }) => {
        const newTeacher = { ...teacher, id: `t-${Date.now()}`, tscNo: `TSC-${Math.floor(10000 + Math.random() * 90000)}` };
        setTeachingStaff(prev => [...prev, newTeacher]);
    };
    
    return (
        <>
            <Tabs defaultValue="teaching">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="font-headline text-3xl font-bold">Staff Management</h1>
                        <p className="text-muted-foreground">Manage all teaching and non-teaching staff at your school.</p>
                    </div>
                    <TabsList>
                        <TabsTrigger value="teaching">
                            <UserCheck className="mr-2" />
                            Teaching Staff
                        </TabsTrigger>
                        <TabsTrigger value="non-teaching">
                            <UserCog className="mr-2" />
                            Non-Teaching Staff
                        </TabsTrigger>
                    </TabsList>
                </div>
                
                <TabsContent value="teaching">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Teaching Staff</CardTitle>
                                <CardDescription>A list of all registered teachers at the school.</CardDescription>
                            </div>
                            <Button onClick={() => setAddTeacherDialogOpen(true)}>
                                <PlusCircle className="mr-2" />
                                Add New Teacher
                            </Button>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>TSC No.</TableHead>
                                        <TableHead>Role/Subjects</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teachingStaff.map((staff) => (
                                        <TableRow key={staff.id}>
                                            <TableCell className="font-medium">{staff.name}</TableCell>
                                            <TableCell>{staff.tscNo}</TableCell>
                                            <TableCell>{staff.role}</TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                         <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="non-teaching">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                             <div>
                                <CardTitle>Non-Teaching Staff</CardTitle>
                                <CardDescription>A list of all administrative and support staff.</CardDescription>
                            </div>
                            <Button>
                                <PlusCircle className="mr-2" />
                                Add New Member
                            </Button>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {nonTeachingStaff.map((staff) => (
                                        <TableRow key={staff.id}>
                                            <TableCell className="font-medium">{staff.name}</TableCell>
                                            <TableCell>{staff.role}</TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                         <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <AddTeacherDialog 
                open={isAddTeacherDialogOpen}
                onOpenChange={setAddTeacherDialogOpen}
                onAddTeacher={handleAddTeacher}
            />
        </>
    );
}
