
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, BookOpen, User, FilePen, ChevronRight, PlusCircle, Settings, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GenerateLessonPlanDialog } from '@/components/generate-lesson-plan-dialog';
import { mockAssignments } from '@/lib/mock-data';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const mockTeacher = {
    name: 'Ms. Okoro',
    classes: [
        { name: 'Form 1 English', studentCount: 42, performance: 75 },
        { name: 'Form 2 English', studentCount: 38, performance: 82 },
        { name: 'Form 2 Literature', studentCount: 35, performance: 78 },
    ],
    totalStudents: 115,
};

const chartData = mockTeacher.classes.map(c => ({ name: c.name.replace(' English', '').replace(' Literature', ''), performance: c.performance }));

export function TeacherDashboard() {
    const [isLessonPlanDialogOpen, setLessonPlanDialogOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Welcome, {mockTeacher.name}!</h1>
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Classes</CardTitle>
                        <p className="text-3xl font-bold">{mockTeacher.classes.length}</p>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                        <p className="text-3xl font-bold">{mockTeacher.totalStudents}</p>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Performance</CardTitle>
                        <p className="text-3xl font-bold">
                            {Math.round(mockTeacher.classes.reduce((acc, c) => acc + c.performance, 0) / mockTeacher.classes.length)}%
                        </p>
                    </CardHeader>
                </Card>
                 <Card className="flex flex-col justify-center items-center">
                     <Button asChild className="w-3/4">
                        <Link href="/student/journey"><Lightbulb className="mr-2"/> Launch Student View</Link>
                    </Button>
                </Card>
            </div>

            <div className="grid gap-6 mt-6 md:grid-cols-5">
                {/* My Classes Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-accent" /> My Hub
                        </CardTitle>
                        <CardDescription>View your classes and take attendance.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mockTeacher.classes.map(c => (
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

                 {/* Recent Submissions Card */}
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
