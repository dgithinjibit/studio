
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mockStaff = [
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

export function StaffManagementTab() {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>
                    Oversee all teaching staff, their class loads, and performance metrics.
                </CardDescription>
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
                        {mockStaff.map((staff) => (
                            <TableRow key={staff.id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={staff.avatar} alt={staff.name} />
                                        <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{staff.name}</span>
                                </TableCell>
                                <TableCell>{staff.role}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {staff.classes.map((c) => (
                                            <Badge key={c} variant="secondary">{c}</Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{staff.avgPerformance}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
