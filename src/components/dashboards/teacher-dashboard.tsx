
"use client";
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, MoreHorizontal, Plus, Bot, Sparkles, Users, Edit, Trash2, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AddClassDialog } from '@/components/add-class-dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import type { Teacher, ClassInfo, Student, TeacherResource } from '@/lib/types';
import { DigitalAttendanceRegister } from '@/components/digital-attendance-register';
import { useToast } from '@/hooks/use-toast';
import { generateDashboardSummary } from '@/ai/flows/generate-dashboard-summary';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from '../ui/skeleton';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { saveClass, deleteClass, getTeacherData } from '@/lib/teacher-service';

const tailwindColorToHex: { [key: string]: string } = {
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#22c55e',
    'bg-orange-500': '#f97316',
    'bg-purple-500': '#8b5cf6',
    'bg-red-500': '#ef4444',
    'bg-yellow-500': '#eab308',
    'bg-pink-500': '#ec4899',
    'bg-teal-500': '#14b8a6',
};

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[350px] w-full" />
        </div>
    </div>
);


export function TeacherDashboard({ initialTeacherData }: { initialTeacherData: Teacher | null }) {
    const [teacher, setTeacher] = useState<Teacher | null>(initialTeacherData);
    const [isAttendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
    const [isAddClassDialogOpen, setAddClassDialogOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);
    const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
    const [summary, setSummary] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const { toast } = useToast();
    const [allResources, setAllResources] = useState<TeacherResource[]>([]);
    const [loading, setLoading] = useState(false); // Used for mutation operations like save/delete

    useEffect(() => {
        // Set initial data from server component props
        if (initialTeacherData) {
            setTeacher(initialTeacherData);
            if (initialTeacherData.classes.length > 0) {
                setSelectedClass(initialTeacherData.classes[0]);
            }
        }

        const unsubscribe = onSnapshot(collection(db, "teacherResources"), (snapshot) => {
            const resourcesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeacherResource));
            setAllResources(resourcesData);
        }, (error) => {
            console.error("Failed to subscribe to resources:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not connect to resource library." });
        });

        return () => unsubscribe();
    }, [initialTeacherData, toast]);
    
    // This effect ensures if a class is deleted, the selectedClass state is updated.
    useEffect(() => {
        if (selectedClass && teacher && !teacher.classes.some(c => c.id === selectedClass.id)) {
            setSelectedClass(teacher.classes.length > 0 ? teacher.classes[0] : null);
        }
    }, [teacher, selectedClass]);
    
    if (!teacher) {
        return (
             <div className="text-center p-8">
                <h2 className="text-xl font-semibold text-destructive">Could Not Load Teacher Data</h2>
                <p className="text-muted-foreground mt-2">
                    Please ensure the database has been seeded by visiting the <code className="bg-muted px-2 py-1 rounded-md">/api/seed</code> endpoint in your browser.
                </p>
                    <p className="text-muted-foreground mt-2">
                    If you have already seeded the data, please check your Firebase connection and security rules.
                    </p>
            </div>
        );
    }

    const chartData = teacher.classes.map(c => ({ 
        name: c.name, 
        performance: c.performance,
        fill: tailwindColorToHex[c.color] || '#8884d8'
    }));
    
    const openAttendance = (classInfo: ClassInfo) => {
        setSelectedClass(classInfo);
        setAttendanceDialogOpen(true);
    };

    const handleSaveClass = async (classDetails: { name: string; color: string; students: Student[] }, classId?: string) => {
        if (!teacher) return;
        setLoading(true);
        try {
            const updatedTeacher = await saveClass(teacher.id, { ...classDetails, id: classId || '' });
            setTeacher(updatedTeacher); // Update local state with the returned fresh data
            setEditingClass(null);
            setAddClassDialogOpen(false);
            toast({
                title: classId ? "Class Updated" : "Class Added",
                description: `"${classDetails.name}" has been successfully saved.`,
            });
        } catch (error) {
            console.error("Error saving class:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not save the class." });
        } finally {
            setLoading(false);
        }
    };
    
    const handleDeleteClass = async (classId: string) => {
        if (!teacher) return;
        setLoading(true);
        try {
            const updatedTeacher = await deleteClass(teacher.id, classId);
            setTeacher(updatedTeacher); // Update local state
            toast({
                variant: "destructive",
                title: "Class Deleted",
                description: "The class has been removed from your hub.",
            });
        } catch (error) {
            console.error("Error deleting class:", error);
            toast({ variant: "destructive", title: "Error", description: "Could not delete the class." });
        } finally {
            setLoading(false);
        }
    };

    const openEditDialog = (classInfo: ClassInfo) => {
        setEditingClass(classInfo);
        setAddClassDialogOpen(true);
    };

    const handleGenerateSummary = async () => {
        setIsSummaryLoading(true);
        setSummary('');
        const relevantResources = allResources.map(({ title, type }) => ({ title, type }));
        const classes = teacher.classes.map(({ name }) => ({ name }));

        try {
            const result = await generateDashboardSummary({
                classes,
                resources: relevantResources
            });
            setSummary(result.summary);
        } catch (error) {
            console.error("Error generating dashboard summary:", error);
            toast({
                variant: 'destructive',
                title: "Error Generating Summary",
                description: "Could not load AI suggestions. Please try again later.",
            });
        } finally {
            setIsSummaryLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Welcome, {teacher.name}!</h1>
                    <p className="text-muted-foreground">Here's your dashboard to manage classes and resources.</p>
                </div>
                 <Button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="w-full md:w-auto">
                    {isSummaryLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Dashboard Summary
                </Button>
            </div>

            {isSummaryLoading && (
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Bot className="w-5 h-5 animate-pulse" /> 
                            <p className="text-sm">Generating AI suggestions for your dashboard...</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {summary && !isSummaryLoading && (
                <Card className="mb-6 bg-accent/20 border-accent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="w-6 h-6 text-accent" /> AI Teaching Assistant
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground">{summary}</p>
                    </CardContent>
                </Card>
            )}

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Class Performance</CardTitle>
                            <CardDescription>An overview of recent performance across your classes.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] w-full">
                        <ChartContainer config={{}} className="w-full h-full">
                            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                                <YAxis tickLine={false} axisLine={false} domain={[60, 100]} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="performance" radius={8}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
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
                                    <BookOpen className="w-6 h-6 text-accent" /> My Hub
                                </CardTitle>
                                <CardDescription>View your classes and take attendance.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => { setEditingClass(null); setAddClassDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Class
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {teacher.classes.map(c => (
                                <div key={c.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => openAttendance(c)}>
                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                            <AvatarFallback className={cn("text-white font-bold", c.color)}>{c.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold">{c.name}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Users className="w-4 h-4" /> {c.students.length} students</p>
                                        </div>
                                    </div>
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => openEditDialog(c)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Class
                                            </DropdownMenuItem>
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" className="w-full justify-start text-sm font-normal text-destructive hover:bg-destructive/10 hover:text-destructive px-2 py-1.5 rounded-sm relative flex cursor-default select-none items-center gap-2">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Class
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the class "{c.name}" and all of its associated data.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteClass(c.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
             
             <AddClassDialog 
                open={isAddClassDialogOpen} 
                onOpenChange={setAddClassDialogOpen} 
                onSaveClass={handleSaveClass}
                initialData={editingClass}
             />

             {selectedClass && (
                 <DigitalAttendanceRegister 
                    open={isAttendanceDialogOpen}
                    onOpenChange={setAttendanceDialogOpen}
                    classInfo={selectedClass}
                    onClassNameUpdate={() => {}}
                    onUpdateStudents={() => {}}
                 />
             )}
        </>
    );
}
