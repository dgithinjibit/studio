
"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FilePen, ChevronRight, PlusCircle, Settings, Users, ClipboardList, CalendarDays, HelpCircle, GraduationCap, Mail, Library } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GenerateLessonPlanDialog } from '@/components/generate-lesson-plan-dialog';
import { GenerateSchemeOfWorkDialog } from '@/components/generate-scheme-of-work-dialog';
import { GenerateRubricDialog } from '@/components/generate-rubric-dialog';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { Teacher, ClassInfo } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyResources } from '@/components/my-resources';
import { DigitalAttendanceRegister } from '@/components/digital-attendance-register';
import { mockTeacher } from '@/lib/mock-data';


interface TeacherDashboardProps {
    teacher: Teacher;
}

const teacherTools = [
    {
        title: "Lesson Plan Generator",
        description: "Create CBC-aligned lesson plans",
        icon: FilePen,
        action: "Open Lesson Plan Generator",
        dialog: "lessonPlan"
    },
    {
        title: "Worksheet Generator",
        description: "Generate printable worksheets",
        icon: ClipboardList,
        action: "Open Worksheet Generator",
        dialog: null
    },
    {
        title: "Schemer: Schemes of Work",
        description: "Create complete Schemes of Work",
        icon: CalendarDays,
        action: "Open Schemer: Schemes of Work",
        dialog: "schemeOfWork"
    },
    {
        title: "Multiple Choice Quiz",
        description: "Generate quizzes and assessments",
        icon: HelpCircle,
        action: "Open Multiple Choice Quiz",
        dialog: null
    },
    {
        title: "Rubric Generator",
        description: "Create custom rubrics",
        icon: GraduationCap,
        action: "Open Rubric Generator",
        dialog: "rubric"
    },
    {
        title: "Email to Family",
        description: "Generate professional parent communications",
        icon: Mail,
        action: "Open Email to Family",
        dialog: null
    }
];

export function TeacherDashboard({ teacher: initialTeacher }: TeacherDashboardProps) {
    const [teacher, setTeacher] = useState<Teacher>(initialTeacher);
    const [isLessonPlanDialogOpen, setLessonPlanDialogOpen] = useState(false);
    const [isSchemeOfWorkDialogOpen, setSchemeOfWorkDialogOpen] = useState(false);
    const [isRubricDialogOpen, setRubricDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isAttendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);

    const chartData = teacher.classes.map(c => ({ 
        name: c.name.replace(' English', '').replace(' Literature', ''), 
        performance: c.performance 
    }));
    
    const handleToolClick = (dialog: string | null) => {
        if (dialog === 'lessonPlan') {
            setLessonPlanDialogOpen(true);
        } else if (dialog === 'schemeOfWork') {
            setSchemeOfWorkDialogOpen(true);
        } else if (dialog === 'rubric') {
            setRubricDialogOpen(true);
        }
    };
    
    const handleClassSelect = (classInfo: ClassInfo) => {
        setSelectedClass(classInfo);
        setAttendanceDialogOpen(true);
    };
    
    const handleClassNameUpdate = (classId: string, newName: string) => {
        setTeacher(prevTeacher => {
            const updatedClasses = prevTeacher.classes.map(c => 
                c.id === classId ? { ...c, name: newName } : c
            );
            const newTeacherState = { ...prevTeacher, classes: updatedClasses };
            
            // Note: This only updates localStorage for the mock.
            // In a real app, you'd save this to a database.
            const storedTeacher = JSON.parse(localStorage.getItem('mockTeacher') || JSON.stringify(mockTeacher));
            storedTeacher.classes = updatedClasses;
            localStorage.setItem('mockTeacher', JSON.stringify(storedTeacher));

            return newTeacherState;
        });
    };

    const onResourceSaved = () => {
        // Switch to the resources tab to show the newly saved plan
        setActiveTab("resources");
        // We need to dispatch a custom event to tell the MyResources component to update
        // because localStorage changes in the same window don't trigger the 'storage' event.
        window.dispatchEvent(new CustomEvent('resource-update'));
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Welcome, {teacher.name}!</h1>
                    <p className="text-muted-foreground">Here's your dashboard to manage classes and resources.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setLessonPlanDialogOpen(true)}>
                        <PlusCircle className="mr-2" />
                        Generate Lesson Plan
                    </Button>
                     <Button variant="outline">
                        <Settings className="mr-2" />
                        AI Tuner
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="tools">Teacher Tools</TabsTrigger>
                    <TabsTrigger value="resources">My Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard" className="mt-6">
                     <div className="grid gap-6 md:grid-cols-5">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="w-6 h-6 text-accent" /> My Hub
                                </CardTitle>
                                <CardDescription>View your classes and take attendance.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {teacher.classes.map(c => (
                                     <div key={c.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                             <Avatar className="h-12 w-12 border-2 border-primary/20">
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">{c.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold">{c.name}</p>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Users className="w-4 h-4" /> {c.students.length} students</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleClassSelect(c)}>
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                             <CardFooter>
                                <Button 
                                    variant="outline" 
                                    className="w-full" 
                                    onClick={() => selectedClass && handleClassSelect(selectedClass)}
                                    disabled={!teacher.classes.length}
                                >
                                    Digital Attendance Register
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="md:col-span-3">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FilePen className="w-6 h-6 text-accent" /> Class Performance
                                </CardTitle>
                                 <CardDescription>An overview of recent performance across your classes.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] w-full">
                               <ChartContainer config={{}} className="w-full h-full">
                                  <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} domain={[60, 100]} />
                                     <ChartTooltip content={<ChartTooltipContent />} />
                                     <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="performance" fill="hsl(var(--primary))" radius={8} />
                                  </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="tools" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-mono text-2xl text-primary">🛠️ Teacher Tools</CardTitle>
                            <CardDescription>Powerful AI-driven tools to assist in your teaching workflow.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teacherTools.map((tool, index) => {
                                const Icon = tool.icon;
                                return (
                                     <Card key={index} className="flex flex-col">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3">
                                                <Icon className="w-6 h-6 text-accent" />
                                                {tool.title}
                                            </CardTitle>
                                            <CardDescription>{tool.description}</CardDescription>
                                        </CardHeader>
                                        <CardFooter className="mt-auto">
                                            <Button variant="secondary" className="w-full" onClick={() => handleToolClick(tool.dialog)}>
                                                {tool.action}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )
                            })}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="resources" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Library className="w-6 h-6 text-accent" />
                                My Resources
                            </CardTitle>
                            <CardDescription>
                                All your saved lesson plans and schemes of work, organized for easy access.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <MyResources />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
             
             <GenerateLessonPlanDialog 
                open={isLessonPlanDialogOpen} 
                onOpenChange={setLessonPlanDialogOpen} 
                onResourceSaved={onResourceSaved}
             />
             <GenerateSchemeOfWorkDialog 
                open={isSchemeOfWorkDialogOpen} 
                onOpenChange={setSchemeOfWorkDialogOpen}
                onResourceSaved={onResourceSaved}
             />
             <GenerateRubricDialog open={isRubricDialogOpen} onOpenChange={setRubricDialogOpen} onResourceSaved={onResourceSaved} />
             {selectedClass && (
                 <DigitalAttendanceRegister 
                    open={isAttendanceDialogOpen}
                    onOpenChange={setAttendanceDialogOpen}
                    classInfo={selectedClass}
                    onClassNameUpdate={handleClassNameUpdate}
                 />
             )}
        </>
    );
}
