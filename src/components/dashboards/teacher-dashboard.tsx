
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, BookOpen, User, FilePen, ChevronRight, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GenerateLessonPlanDialog } from '@/components/generate-lesson-plan-dialog';
import { mockAssignments } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';

const mockTeacher = {
    name: 'Ms. Okoro',
    classes: [
        { name: 'Form 1 English', studentCount: 42 },
        { name: 'Form 2 English', studentCount: 38 },
    ],
};

export function TeacherDashboard() {
    const [isLessonPlanDialogOpen, setLessonPlanDialogOpen] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Welcome, {mockTeacher.name}!</h1>
                    <p className="text-muted-foreground">Here's your dashboard to manage classes and resources.</p>
                </div>
                <Button onClick={() => setLessonPlanDialogOpen(true)}>
                    <PlusCircle className="mr-2" />
                    Generate Lesson Plan
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* AI Tutor Card */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-6 h-6 text-accent"/> AI Tutor
                        </CardTitle>
                        <CardDescription>Launch the student view to interact with Mwalimu AI.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end">
                        <Button asChild>
                            <Link href="/student/journey">Start Learning</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* My Classes Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-accent" /> My Classes
                        </CardTitle>
                        <CardDescription>View and manage your assigned classes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mockTeacher.classes.map(c => (
                             <div key={c.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                <div>
                                    <p className="font-medium">{c.name}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> {c.studentCount} students</p>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                 {/* Recent Submissions Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FilePen className="w-6 h-6 text-accent" /> Recent Submissions
                        </CardTitle>
                         <CardDescription>Review the latest work from your students.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mockAssignments.slice(0, 3).map(submission => (
                            <div key={submission.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={`/avatars/${submission.studentId}.png`} alt={submission.studentName} />
                                    <AvatarFallback>{submission.studentName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="font-medium">{submission.studentName}</p>
                                    <p className="text-sm text-muted-foreground truncate">{submission.title}</p>
                                </div>
                                <div className="text-right">
                                     <p className="text-xs text-muted-foreground">{formatDistanceToNow(submission.submittedAt, { addSuffix: true })}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                     <CardFooter>
                        <Button variant="outline" className="w-full">View All Submissions</Button>
                    </CardFooter>
                </Card>

            </div>
             <GenerateLessonPlanDialog open={isLessonPlanDialogOpen} onOpenChange={setLessonPlanDialogOpen} />
        </>
    );
}
