
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, Plus, Users, Bot, Send, UserCheck, Percent, Megaphone, Library, BrainCircuit, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AddClassDialog } from '@/components/add-class-dialog';
import type { Teacher, ClassInfo, Student, TeacherResource } from '@/lib/types';
import { DigitalAttendanceRegister } from '@/components/digital-attendance-register';
import { mockTeacher } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { MyResources } from '../my-resources';
import { Textarea } from '../ui/textarea';
import { schoolHeadConsultant } from '@/ai/flows/school-head-consultant';
import Link from 'next/link';

export function SchoolHeadDashboard() {
    const [schoolData, setSchoolData] = useState<Teacher>(mockTeacher);
    const [isAttendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
    const [isAddClassDialogOpen, setAddClassDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
    const { toast } = useToast();

    // State for AI Consultant
    const [consultantQuestion, setConsultantQuestion] = useState('');
    const [consultantResponse, setConsultantResponse] = useState('');
    const [isConsultantLoading, setIsConsultantLoading] = useState(false);


    useEffect(() => {
        const storedData = localStorage.getItem('mockTeacher');
        if (storedData) {
            setSchoolData(JSON.parse(storedData));
        } else {
            setSchoolData(mockTeacher);
        }
    }, []);
    
    useEffect(() => {
        if (schoolData.classes.length > 0 && !selectedClass) {
            const currentSelectedClass = schoolData.classes.find(c => c.id === (selectedClass?.id || schoolData.classes[0].id));
            setSelectedClass(currentSelectedClass || schoolData.classes[0]);
        }
    }, [schoolData.classes, selectedClass]);
    
    const handleClassSelect = (classInfo: ClassInfo) => {
        setSelectedClass(classInfo);
        setAttendanceDialogOpen(true);
    };
    
    const updateSchoolData = (newSchoolState: Teacher) => {
        setSchoolData(newSchoolState);
        localStorage.setItem('mockTeacher', JSON.stringify(newSchoolState));
    };

    const handleUpdateStudents = (classId: string, newStudents: Student[]) => {
        const updatedClasses = schoolData.classes.map(c => 
            c.id === classId ? { ...c, students: newStudents } : c
        );
        updateSchoolData({ ...schoolData, classes: updatedClasses });
    };

    const handleClassNameUpdate = (classId: string, newName: string) => {
        const updatedClasses = schoolData.classes.map(c => 
            c.id === classId ? { ...c, name: newName } : c
        );
        updateSchoolData({ ...schoolData, classes: updatedClasses });
    };
    
    const handleAddClass = (className: string) => {
        const newClass: ClassInfo = {
            id: `class_${Date.now()}`,
            name: className,
            performance: 75,
            students: [],
        };

        const updatedClasses = [...schoolData.classes, newClass];
        updateSchoolData({ ...schoolData, classes: updatedClasses });
        
        toast({
            title: "Class Added",
            description: `"${className}" has been added to your school.`,
        })
    };
    
    const handleConsultantSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consultantQuestion.trim()) return;

        setIsConsultantLoading(true);
        setConsultantResponse('');

        const allResources: TeacherResource[] = JSON.parse(localStorage.getItem('teacherResources') || '[]');

        try {
            const result = await schoolHeadConsultant({
                question: consultantQuestion,
                schoolData: {
                    teacherCount: 5, // Mock data
                    studentCount: totalStudents,
                    averageAttendance: 92, // Mock data
                    classes: schoolData.classes.map(c => ({ name: c.name, studentCount: c.students.length, averagePerformance: c.performance })),
                    resources: allResources.map((r: any) => ({ title: r.title, type: r.type })),
                }
            });
            setConsultantResponse(result.response);
        } catch (error) {
            console.error("Error with AI Consultant:", error);
            toast({
                variant: 'destructive',
                title: "Error Getting Insight",
                description: "The AI consultant could not process your request. Please try again."
            })
        } finally {
            setIsConsultantLoading(false);
        }
    }
    
    const totalStudents = schoolData.classes.reduce((acc, c) => acc + c.students.length, 0);
    const totalTeachers = 5; // Mock data for now
    const studentTeacherRatio = totalStudents > 0 ? totalStudents / totalTeachers : 0;

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-headline text-3xl font-bold">School Administrator Dashboard</h1>
                    <p className="text-muted-foreground">Oversee all school operations, performance, and resources.</p>
                </div>
            </div>

            <Tabs defaultValue="dashboard">
                <TabsList className="mb-4">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="resources">Resource Management</TabsTrigger>
                    <TabsTrigger value="staff">Staff Management</TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalStudents}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Student-Teacher Ratio</CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{studentTeacherRatio.toFixed(1)} : 1</div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                                <Percent className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">92%</div>
                                <p className="text-xs text-muted-foreground">+2% from last month</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BrainCircuit className="text-primary w-6 h-6"/>
                                AI Operational Consultant
                            </CardTitle>
                            <CardDescription>Ask strategic questions about your school's data to get AI-powered insights.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleConsultantSubmit}>
                            <CardContent className="space-y-4">
                                <Textarea 
                                    placeholder="e.g., 'What is the impact of our low stock of Science Kits on Grade 5 performance?' or 'Which classes are showing the most improvement this term?'"
                                    value={consultantQuestion}
                                    onChange={(e) => setConsultantQuestion(e.target.value)}
                                    className="h-28"
                                    disabled={isConsultantLoading}
                                />
                                {isConsultantLoading && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Bot className="w-5 h-5 animate-pulse" />
                                        <p>Analyzing school data and generating insights...</p>
                                    </div>
                                )}
                                {consultantResponse && (
                                    <Card className="bg-muted/50">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Consultant's Analysis</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm whitespace-pre-wrap">{consultantResponse}</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isConsultantLoading || !consultantQuestion.trim()}>
                                    <Send className="mr-2"/>
                                    Ask Question
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-6 h-6 text-accent" /> School Hub
                                </CardTitle>
                                <CardDescription>Manage all classes and take attendance.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setAddClassDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Class
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {schoolData.classes.map(c => (
                                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleClassSelect(c)}>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{c.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold">{c.name}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Users className="w-4 h-4" /> {c.students.length} students</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="resources">
                    <MyResources />
                </TabsContent>
                <TabsContent value="staff">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="text-primary w-6 h-6"/>
                                Staff Management
                            </CardTitle>
                            <CardDescription>A central hub for all staff-related information and management.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Oversee all teaching staff, their class loads, and performance metrics. For a detailed view, visit the main staff page.</p>
                             <Button asChild>
                                <Link href="/dashboard/staff">
                                    Open Staff Hub
                                    <ChevronRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
             
             <AddClassDialog open={isAddClassDialogOpen} onOpenChange={setAddClassDialogOpen} onAddClass={handleAddClass} />

             {selectedClass && (
                 <DigitalAttendanceRegister 
                    open={isAttendanceDialogOpen}
                    onOpenChange={setAttendanceDialogOpen}
                    classInfo={selectedClass}
                    onClassNameUpdate={handleClassNameUpdate}
                    onUpdateStudents={handleUpdateStudents}
                 />
             )}
        </>
    );
}

    
