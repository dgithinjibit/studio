
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MyResources } from "@/components/my-resources";
import { BarChart2, Megaphone, Send } from "lucide-react";
import { getServerUser } from "@/lib/auth";
import type { UserRole, Communication } from "@/lib/types";
import { Button } from '@/components/ui/button';
import { AddCommunicationDialog } from '@/components/add-communication-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function TeacherResourcesView() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="font-headline text-3xl font-bold">My Library</h1>
                <p className="text-muted-foreground">All your saved Learning Labs, generated documents, and communications organized for easy access.</p>
            </div>
            <MyResources />
        </div>
    );
}

function SchoolHeadReportsView() {
    const [isAddCommDialogOpen, setAddCommDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleAddCommunication = (comm: Omit<Communication, 'id' | 'date' | 'acknowledged'>) => {
        const schoolHeadName = localStorage.getItem('userName') || 'School Head';
        const newComm: Communication = {
          id: `comm_${Date.now()}`,
          ...comm,
          date: new Date(),
          acknowledged: false,
          sender: schoolHeadName,
        };
        
        const existingComms: Communication[] = JSON.parse(localStorage.getItem('mockCommunications') || '[]');
        localStorage.setItem('mockCommunications', JSON.stringify([newComm, ...existingComms]));

        toast({
            title: "Announcement Sent",
            description: `Your announcement "${comm.title}" has been sent.`,
        });
        
        setAddCommDialogOpen(false);
        // Optionally, redirect to a page where they can see the announcement log
        // router.push('/dashboard/communications');
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <BarChart2 className="w-6 h-6 text-primary" />
                        School-Wide Reports & Announcements
                    </CardTitle>
                    <CardDescription>
                        This dashboard provides aggregated school reports and tools to send announcements to all staff.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Megaphone />
                                Send Announcement
                            </CardTitle>
                            <CardDescription>
                                Broadcast a message to all teachers. It will appear in their communications log.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Button onClick={() => setAddCommDialogOpen(true)}>
                                <Send className="mr-2" />
                                Create New Announcement
                            </Button>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2 text-lg">
                                <BarChart2 />
                                Performance Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-muted-foreground p-8">
                                <p>School-wide reporting features are coming soon.</p>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
             <AddCommunicationDialog 
                open={isAddCommDialogOpen} 
                onOpenChange={setAddCommDialogOpen} 
                onAddCommunication={handleAddCommunication} 
            />
        </>
    )
}

// This is an async component because it needs to fetch the user role on the server.
export default async function ReportsPage() {
    // We need to determine the role on the server to decide which view to render.
    // However, the component itself needs to be a client component to use state and hooks.
    // This is a common pattern in Next.js App Router.
    const user = await getServerUser();
    const role = user?.role as UserRole;

    if (role === 'school_head') {
        return <SchoolHeadReportsView />;
    }

    // Default to teacher view for teachers and any other role
    return <TeacherResourcesView />;
}


    