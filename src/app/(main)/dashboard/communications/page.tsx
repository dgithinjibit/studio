
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { mockCommunications } from "@/lib/mock-data";
import type { Communication } from "@/lib/types";
import { format } from "date-fns";
import { Bell, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCommunicationDialog } from '@/components/add-communication-dialog';

export default function CommunicationsPage() {
    const [communications, setCommunications] = useState<Communication[]>(mockCommunications);
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);

    const handleAcknowledgementChange = (id: string, checked: boolean) => {
        setCommunications(prev => 
            prev.map(comm => comm.id === id ? { ...comm, acknowledged: checked } : comm)
        );
    };

    const handleAddCommunication = (newComm: Omit<Communication, 'id' | 'date' | 'acknowledged'>) => {
        const newCommunication: Communication = {
            ...newComm,
            id: `comm_${Date.now()}`,
            date: new Date(),
            acknowledged: false,
        };
        setCommunications(prev => [newCommunication, ...prev]);
    };


    return (
        <>
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-3 font-headline text-3xl">
                                <Bell className="w-8 h-8 text-primary" />
                                Communications Hub
                            </CardTitle>
                            <CardDescription>
                                Manage and track official school-wide announcements. Check items to mark them as acknowledged or completed.
                            </CardDescription>
                        </div>
                        <Button onClick={() => setAddDialogOpen(true)}>
                            <PlusCircle className="mr-2" />
                            New Announcement
                        </Button>
                    </CardHeader>
                </Card>

                <div className="space-y-4">
                    {communications.map((comm) => (
                        <Card key={comm.id} className={`transition-opacity ${comm.acknowledged ? 'opacity-60' : ''}`}>
                            <CardContent className="p-4 flex items-start gap-4">
                                <Checkbox 
                                    id={`comm-${comm.id}`}
                                    className="mt-1 h-5 w-5"
                                    checked={comm.acknowledged}
                                    onCheckedChange={(checked) => handleAcknowledgementChange(comm.id, !!checked)}
                                />
                                <div className="flex-1 grid gap-1">
                                    <div className="flex justify-between items-start">
                                        <label htmlFor={`comm-${comm.id}`} className={`font-semibold cursor-pointer ${comm.acknowledged ? 'line-through' : ''}`}>
                                            {comm.title}
                                        </label>
                                        <Badge variant="secondary">{comm.recipient}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{comm.content}</p>
                                    <p className="text-xs text-muted-foreground pt-2">{format(new Date(comm.date), 'PPP')}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
             <AddCommunicationDialog 
                open={isAddDialogOpen}
                onOpenChange={setAddDialogOpen}
                onAddCommunication={handleAddCommunication}
            />
        </>
    );
}
