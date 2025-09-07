
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, Plus, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AddClassDialog } from '@/components/add-class-dialog';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { Teacher, ClassInfo, Student } from '@/lib/types';
import { DigitalAttendanceRegister } from '@/components/digital-attendance-register';
import { mockTeacher } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { MyResources } from '../my-resources';

export function SchoolHeadDashboard() {
    const [schoolData, setSchoolData] = useState<Teacher>(mockTeacher);
    const [isAttendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
    const [isAddClassDialogOpen, setAddClassDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
    const { toast } = useToast();

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


    const chartData = schoolData.classes.map(c => ({ 
        name: c.name.replace(' English', '').replace(' Literature', ''), 
        performance: c.performance 
    }));
    
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

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-headline text-3xl font-bold">School Administrator Dashboard</h1>
                    <p className="text-muted-foreground">Oversee all school operations, performance, and resources.</p>
                </div>
            </div>

            <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                    <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
                    <TabsTrigger value="resources">Resource Inventory</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>School-Wide Class Performance</CardTitle>
                                    <CardDescription>An overview of recent performance across all classes.</CardDescription>
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
                        
                        <div className="lg:col-span-1">
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
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="resources">
                    <MyResources />
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
