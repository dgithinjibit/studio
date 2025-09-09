
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Users, BookOpen, Package, Bell, Send } from 'lucide-react';
import type { TeacherResource, Communication } from '@/lib/types';
import { mockTeacher } from '@/lib/mock-data';
import { schoolHeadConsultant } from '@/ai/flows/school-head-consultant';
import { AddStaffDialog } from '../add-staff-dialog';
import { AddCommunicationDialog } from '../add-communication-dialog';
import { format } from 'date-fns';


export function SchoolHeadDashboard() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] =useState('');
  const { toast } = useToast();
  const [resources, setResources] = useState<TeacherResource[]>([]);
  const [isAddTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);
  const [isAddCommDialogOpen, setAddCommDialogOpen] =useState(false);
  const [teachers, setTeachers] = useState<{name: string, role: string}[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);


   useEffect(() => {
    // In a real app, this data would be fetched from a database like Firestore
    const storedResources = localStorage.getItem('teacherResources');
    if (storedResources) {
      setResources(JSON.parse(storedResources));
    }
    const storedTeachers = localStorage.getItem('mockTeachers');
    if (storedTeachers) {
        setTeachers(JSON.parse(storedTeachers));
    }
    const storedComms = localStorage.getItem('mockCommunications');
     if (storedComms) {
        setCommunications(JSON.parse(storedComms).map((c: any) => ({...c, date: new Date(c.date)})));
    }
  }, []);

  const handleAskConsultant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResponse('');

    try {
        const result = await schoolHeadConsultant({
            question,
            schoolData: {
                teacherCount: 25,
                studentCount: 500,
                averageAttendance: 92,
                classes: mockTeacher.classes,
                resources: resources.map(({title, type}) => ({title, type})),
            }
        });
        setResponse(result.response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Getting Advice",
        description: "An AI error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = (teacher: { name: string; role: string }) => {
    const updatedTeachers = [...teachers, teacher];
    setTeachers(updatedTeachers);
    localStorage.setItem('mockTeachers', JSON.stringify(updatedTeachers));
    toast({
        title: "Teacher Added",
        description: `${teacher.name} has been added to the staff list.`,
    });
  };
  
  const handleAddCommunication = (comm: Omit<Communication, 'id' | 'date' | 'acknowledged'>) => {
    const schoolHeadName = localStorage.getItem('userName') || 'School Head';
    const newComm: Communication = {
      id: `comm_${Date.now()}`,
      ...comm,
      date: new Date(),
      acknowledged: false,
      sender: schoolHeadName,
    };

    const updatedComms = [newComm, ...communications];
    setCommunications(updatedComms);
    localStorage.setItem('mockCommunications', JSON.stringify(updatedComms));
    toast({
        title: "Announcement Sent",
        description: `Your announcement "${comm.title}" has been sent to ${comm.recipient}.`,
    });
  };

  return (
    <>
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-headline text-3xl font-bold">School Head's Dashboard</h1>
                <p className="text-muted-foreground">Operational overview and strategic tools for your school.</p>
            </div>
            <Button onClick={() => setAddCommDialogOpen(true)}>
                <Send className="mr-2" />
                New Announcement
            </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="lg:col-span-2">
                <form onSubmit={handleAskConsultant}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> AI Operational Consultant</CardTitle>
                    <CardDescription>Ask a strategic question based on your school's data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <Label htmlFor="consultant-question">Your Question</Label>
                        <Textarea 
                            id="consultant-question"
                            placeholder="e.g., 'Which class needs the most resources for the next term?' or 'Where should I focus my teacher training budget?'"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                     </div>
                    {loading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin" /> 
                            <p className="text-sm">Analyzing school data...</p>
                        </div>
                    )}
                    {response && !loading && (
                         <div className="p-4 bg-muted/50 rounded-lg border">
                            <h4 className="font-semibold mb-2">Consultant's Advice:</h4>
                            <p className="text-sm text-foreground">{response}</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading || !question}>
                        {loading ? <Loader2 className="mr-2 animate-spin"/> : <Sparkles className="mr-2" />}
                        {loading ? "Analyzing..." : "Ask Consultant"}
                    </Button>
                </CardFooter>
                </form>
            </Card>
        </div>

         <div className="grid gap-6 md:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><Users /> Teachers</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setAddTeacherDialogOpen(true)}>Add</Button>
                </CardHeader>
                <CardContent className="space-y-2">
                    {teachers.length > 0 ? teachers.slice(0, 4).map((teacher, i) => (
                         <div key={i} className="text-sm p-2 bg-muted/50 rounded-md">
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-xs text-muted-foreground">{teacher.role}</p>
                        </div>
                    )) : (
                         <p className="text-sm text-muted-foreground text-center py-4">No teachers added.</p>
                    )}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Package /> Resources</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-2">
                    {resources.length > 0 ? resources.slice(0, 4).map(res => (
                         <div key={res.id} className="text-sm p-2 bg-muted/50 rounded-lg">
                            <p className="font-medium truncate">{res.title}</p>
                            <p className="text-xs text-muted-foreground">{res.type}</p>
                        </div>
                    )) : (
                         <p className="text-sm text-muted-foreground text-center py-4">No resources created.</p>
                    )}
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell /> Communications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {communications.length > 0 ? communications.slice(0, 4).map(comm => (
                         <div key={comm.id} className="text-sm p-2 bg-muted/50 rounded-lg">
                            <p className="font-medium truncate">{comm.title}</p>
                            <p className="text-xs text-muted-foreground">To: {comm.recipient} on {format(comm.date, 'MMM d')}</p>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No communications sent.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
    <AddStaffDialog 
        open={isAddTeacherDialogOpen} 
        onOpenChange={setAddTeacherDialogOpen} 
        onAddStaff={handleAddTeacher}
        title="Add New Teacher"
        description="Enter the details for the new teaching staff member."
    />
    <AddCommunicationDialog open={isAddCommDialogOpen} onOpenChange={setAddCommDialogOpen} onAddCommunication={handleAddCommunication} />
    </>
  );
}
