
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, UserCheck, UserCog } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { AddStaffDialog } from '@/components/add-staff-dialog';
import { EditStaffDialog } from '@/components/edit-staff-dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import type { TeachingStaff, NonTeachingStaff } from '@/lib/types';


const mockTeachingStaff: TeachingStaff[] = [
    { id: 't-1', name: 'Ms. Chidinma Okoro', tscNo: 'TSC-12345', role: 'English/Literature', category: 'Teaching' },
    { id: 't-2', name: 'Mr. David Mwangi', tscNo: 'TSC-67890', role: 'Mathematics', category: 'Teaching' },
    { id: 't-3', name: 'Mrs. Fatuma Ali', tscNo: 'TSC-54321', role: 'Kiswahili/CRE', category: 'Teaching' },
];

const mockNonTeachingStaff: NonTeachingStaff[] = [
    { id: 'nt-1', name: 'Mr. James Ochieng', role: 'Bursar', category: 'Non-Teaching' },
    { id: 'nt-2', name: 'Mrs. Alice Wambui', role: 'Secretary', category: 'Non-Teaching' },
    { id: 'nt-3', name: 'Mr. Peter Kamau', role: 'Groundsman', category: 'Non-Teaching' },
];

export default function SchoolStaffPage() {
    const [teachingStaff, setTeachingStaff] = useState(mockTeachingStaff);
    const [nonTeachingStaff, setNonTeachingStaff] = useState(mockNonTeachingStaff);
    const [isAddTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);
    const [isAddNonTeachingDialogOpen, setAddNonTeachingDialogOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<TeachingStaff | NonTeachingStaff | null>(null);
    const { toast } = useToast();

    const handleAddTeacher = (teacher: { name: string; role: string }) => {
        const newTeacher: TeachingStaff = { 
            ...teacher, 
            id: `t-${Date.now()}`, 
            tscNo: `TSC-${Math.floor(10000 + Math.random() * 90000)}`,
            category: 'Teaching'
        };
        setTeachingStaff(prev => [...prev, newTeacher]);
    };
    
    const handleAddNonTeachingStaff = (staff: { name: string; role: string }) => {
        const newStaff: NonTeachingStaff = {
            ...staff,
            id: `nt-${Date.now()}`,
            category: 'Non-Teaching'
        };
        setNonTeachingStaff(prev => [...prev, newStaff]);
        toast({
            title: "Staff Member Added",
            description: `${staff.name} has been added to the non-teaching staff list.`
        });
    };

    const handleDeleteTeacher = (id: string) => {
        setTeachingStaff(prev => prev.filter(staff => staff.id !== id));
        toast({
            title: "Staff Member Removed",
            description: "The teacher has been removed from the list.",
            variant: "destructive"
        });
    };
    
    const handleUpdateStaff = (updatedStaff: TeachingStaff | NonTeachingStaff) => {
        if (updatedStaff.category === 'Teaching') {
            setTeachingStaff(prev => prev.map(staff => staff.id === updatedStaff.id ? (updatedStaff as TeachingStaff) : staff));
        } else {
            setNonTeachingStaff(prev => prev.map(staff => staff.id === updatedStaff.id ? (updatedStaff as NonTeachingStaff) : staff));
        }
        setEditingStaff(null);
        toast({
            title: "Staff Details Updated",
            description: `${updatedStaff.name}'s information has been successfully updated.`
        });
    };

    const handleDeleteNonTeachingStaff = (id: string) => {
        setNonTeachingStaff(prev => prev.filter(staff => staff.id !== id));
        toast({
            title: "Staff Member Removed",
            description: "The non-teaching staff member has been removed from the list.",
            variant: "destructive"
        });
    };
    
    return (
        <>
            <Tabs defaultValue="teaching">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="font-headline text-3xl font-bold">School Staff Management</h1>
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
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teachingStaff.map((staff) => (
                                        <TableRow key={staff.id}>
                                            <TableCell className="font-medium">{staff.name}</TableCell>
                                            <TableCell>{staff.tscNo}</TableCell>
                                            <TableCell><Badge variant="outline">{staff.role}</Badge></TableCell>
                                            <TableCell><Badge variant="secondary">{staff.category}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setEditingStaff(staff)}>Edit</DropdownMenuItem>
                                                         <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTeacher(staff.id)}>Delete</DropdownMenuItem>
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
                            <Button onClick={() => setAddNonTeachingDialogOpen(true)}>
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
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {nonTeachingStaff.map((staff) => (
                                        <TableRow key={staff.id}>
                                            <TableCell className="font-medium">{staff.name}</TableCell>
                                            <TableCell><Badge variant="outline">{staff.role}</Badge></TableCell>
                                            <TableCell><Badge>{staff.category}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setEditingStaff(staff)}>Edit</DropdownMenuItem>
                                                         <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteNonTeachingStaff(staff.id)}>Delete</DropdownMenuItem>
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

            <AddStaffDialog 
                open={isAddTeacherDialogOpen}
                onOpenChange={setAddTeacherDialogOpen}
                onAddStaff={handleAddTeacher}
                title="Add New Teacher"
                description="Enter the details for the new teaching staff member."
            />
            
            <AddStaffDialog
                open={isAddNonTeachingDialogOpen}
                onOpenChange={setAddNonTeachingDialogOpen}
                onAddStaff={handleAddNonTeachingStaff}
                title="Add Non-Teaching Staff Member"
                description="Enter the details for the new support staff member."
            />

            {editingStaff && (
                <EditStaffDialog
                    open={!!editingStaff}
                    onOpenChange={(isOpen) => !isOpen && setEditingStaff(null)}
                    staffMember={editingStaff}
                    onUpdateStaff={handleUpdateStaff}
                />
            )}
        </>
    );
}

    