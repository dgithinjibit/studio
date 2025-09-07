
"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FilePen, ChevronRight, PlusCircle, Settings, Users, ClipboardList, CalendarDays, HelpCircle, GraduationCap, Mail } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GenerateLessonPlanDialog } from '@/components/generate-lesson-plan-dialog';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { Teacher } from '@/lib/types';

interface TeacherDashboardProps {
    teacher: Teacher;
}

const teacherTools = [
    {
        title: "Lesson Plan Generator",
        description: "Create CBC-aligned lesson plans",
        icon: FilePen,
        action: "Open Lesson Plan Generator"
    },
    {
        title: "Worksheet Generator",
        description: "Generate printable worksheets",
        icon: ClipboardList,
        action: "Open Worksheet Generator"
    },
    {
        title: "Schemer: Schemes of Work",
        description: "Create complete Schemes of Work",
        icon: CalendarDays,
        action: "Open Schemer: Schemes of Work"
    },
    {
        title: "Multiple Choice Quiz",
        description: "Generate quizzes and assessments",
        icon: HelpCircle,
        action: "Open Multiple Choice Quiz"
    },
    {
        title: "Rubric Generator",
        description: "Create custom rubrics",
        icon: GraduationCap,
        action: "Open Rubric Generator"
    },
    {
        title: "Email to Family",
        description: "Generate professional parent communications",
        icon: Mail,
        action: "Open Email to Family"
    }
];

export function TeacherDashboard({ teacher }: TeacherDashboardProps) {
    const [isLessonPlanDialogOpen, setLessonPlanDialogOpen] = useState(false);
    
    const chartData = teacher.classes.map(c => ({ 
        name: c.name.replace(' English', '').replace(' Literature', ''), 
        performance: c.performance 
    }));

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
            
            <div className="mb-8">
                <h2 className="text-2xl font-headline mb-4 flex items-center gap-2">
                    <span className="font-mono text-2xl text-primary">🛠️</span> Teacher Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                    <Button variant="secondary" className="w-full" onClick={() => index === 0 && setLessonPlanDialogOpen(true)}>
                                        {tool.action}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </div>

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
                             <div key={c.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                     <Avatar className="h-12 w-12 border-2 border-primary/20">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{c.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">{c.name}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Users className="w-4 h-4" /> {c.studentCount} students</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                     <CardFooter>
                        <Button variant="outline" className="w-full">
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
             <GenerateLessonPlanDialog open={isLessonPlanDialogOpen} onOpenChange={setLessonPlanDialogOpen} />
        </>
    );
}
