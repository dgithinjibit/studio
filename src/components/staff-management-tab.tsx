
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { AddTeacherDialog } from './add-teacher-dialog';

const initialStaff = [
    {
        id: "staff_1",
        name: "Ms. Chidinma Okoro",
        avatar: "/path/to/avatar1.png",
        role: "Teacher",
        classes: ["Form 1 English", "Form 2 English", "Form 2 Literature"],
        avgPerformance: "80%",
    },
    {
        id: "staff_2",
        name: "Mr. David Mwangi",
        avatar: "/path/to/avatar2.png",
        role: "Teacher",
        classes: ["Form 1 Maths", "Form 2 Maths"],
        avgPerformance: "75%",
    },
     {
        id: "staff_3",
        name: "Ms. Amina Hussein",
        avatar: "/path/to/avatar3.png",
        role: "Teacher",
        classes: ["Form 3 History", "Form 4 Government"],
        avgPerformance: "85%",
    },
     {
        id: "staff_4",
        name: "Mr. John Omondi",
        avatar: "/path/to/avatar4.png",
        role: "Lab Technician",
        classes: ["Chemistry Labs", "Physics Labs"],
        avgPerformance: "N/A",
    },
];

type StaffMember = typeof initialStaff[0];

export function StaffManagementTab() {
    const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
    const [isAddTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);

    const handleAddTeacher = (newTeacher: { name: string; role: string }) => {
        const newStaffMember: StaffMember = {
            ...newTeacher,
            id: `staff_${Date.now()}`,
            avatar: '',
            classes: [],
            avgPerformance: 'N/A'
        };
        setStaff(prev => [newStaffMember, ...prev]);
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Staff Management</CardTitle>
                        <CardDescription>
                            Oversee all teaching staff. Total Teachers: {staff.length}
                        </CardDescription>
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
                                <TableHead>Staff Member</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Assigned Classes</TableHead>
                                <TableHead>Avg. Performance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staff.map((staffMember) => (
                                <TableRow key={staffMember.id}>
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={staffMember.avatar} alt={staffMember.name} />
                                            <AvatarFallback>{staffMember.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{staffMember.name}</span>
                                    </TableCell>
                                    <TableCell>{staffMember.role}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {staffMember.classes.map((c) => (
                                                <Badge key={c} variant="secondary">{c}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{staffMember.avgPerformance}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <AddTeacherDialog 
                open={isAddTeacherDialogOpen}
                onOpenChange={setAddTeacherDialogOpen}
                onAddTeacher={handleAddTeacher}
            />
        </>
    );
}
