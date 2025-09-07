
"use client";
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FilePen, ChevronRight, PlusCircle, Settings, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AITunerDialog } from '@/components/ai-tuner-dialog';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { Teacher, ClassInfo } from '@/lib/types';
import { DigitalAttendanceRegister } from '@/components/digital-attendance-register';
import { mockTeacher } from '@/lib/mock-data';
import Link from 'next/link';


interface TeacherDashboardProps {
    teacher: Teacher;
}

export function TeacherDashboard({ teacher: initialTeacher }: TeacherDashboardProps) {
    const [teacher, setTeacher] = useState<Teacher>(initialTeacher);
    const [isAITunerDialogOpen, setAITunerDialogOpen] = useState(false);
    const [isAttendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);

    useEffect(() => {
        setTeacher(initialTeacher);
    }, [initialTeacher]);
    
    useEffect(() => {
        if (initialTeacher.classes.length > 0 && !selectedClass) {
            setSelectedClass(initialTeacher.classes[0]);
        }
    }, [initialTeacher.classes, selectedClass]);

    const chartData = teacher.classes.map(c => ({ 
        name: c.name.replace(' English', '').replace(' Literature', ''), 
        performance: c.performance 
    }));
    
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
            
            const storedTeacher = JSON.parse(localStorage.getItem('mockTeacher') || JSON.stringify(mockTeacher));
            storedTeacher.classes = updatedClasses;
            localStorage.setItem('mockTeacher', JSON.stringify(storedTeacher));

            return newTeacherState;
        });
    };

    const onResourceSaved = () => {
        window.dispatchEvent(new CustomEvent('resource-update'));
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Welcome, Teacher!</h1>
                    <p className="text-muted-foreground">Here's your dashboard to manage classes and resources.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="/dashboard/tools">
                            <PlusCircle className="mr-2" />
                            Generate Resources
                        </Link>
                    </Button>
                     <Button variant="outline" onClick={() => setAITunerDialogOpen(true)}>
                        <Settings className="mr-2" />
                        AI Tuner
                    </Button>
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
             
             <AITunerDialog open={isAITunerDialogOpen} onOpenChange={setAITunerDialogOpen} onResourceSaved={onResourceSaved} />

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
