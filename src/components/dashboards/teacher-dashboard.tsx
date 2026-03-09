
'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  ArrowRight,
  Book,
  Bot,
  FlaskConical,
  GraduationCap,
  Key,
  Sparkles,
  Users,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { Teacher, LearningSummary } from '@/lib/types';
import { mockTeacher, mockLearningSummaries } from '@/lib/mock-data';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function TeacherDashboard() {
  const [learningSummaries, setLearningSummaries] = useState<LearningSummary[]>(mockLearningSummaries);
  const [teacherName, setTeacherName] = useState('Mwalimu Demo');
  const [isLoading, setIsLoading] = useState(true);
  const teacherData = mockTeacher;

  useEffect(() => {
    const auth = getAuth(app);
    
    // Set initial name from local storage if available
    const storedName = localStorage.getItem('userName');
    if (storedName) setTeacherName(storedName);

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
            setTeacherName(storedName || user.displayName || 'Teacher');
            
            const q = query(
                collection(db, "learningSummaries"), 
                where("teacherId", "==", user.uid),
                orderBy("createdAt", "desc"),
                limit(10)
            );
            
            const unsubscribeSummaries = onSnapshot(q, (snapshot) => {
                if (!snapshot.empty) {
                    const summaries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningSummary));
                    setLearningSummaries(summaries);
                } else {
                    // Stay with mock data if none found in Firestore
                    setLearningSummaries(mockLearningSummaries);
                }
                setIsLoading(false);
            });

            return () => unsubscribeSummaries();
        } else {
            // Not logged in to Firebase (Demo Mode), use mock data
            setLearningSummaries(mockLearningSummaries);
            setIsLoading(false);
        }
    });

    return () => unsubscribeAuth();
  }, []);

  const averagePerformance = teacherData.classes.length > 0
      ? Math.round(
          teacherData.classes.reduce((sum, c) => sum + c.performance, 0) /
          teacherData.classes.length
        )
      : 0;

  const performanceData = teacherData.classes.map(c => ({
      name: c.name.split(' ').slice(-1)[0], // Just the subject name
      performance: c.performance
  }));

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
                <h1 className="text-2xl md:text-4xl font-bold font-headline text-foreground">
                    Karibu, {teacherName}
                </h1>
                <p className="text-muted-foreground text-lg">Here is your teaching summary for today.</p>
            </div>
            <div className="flex items-center gap-3">
                 <Button asChild size="lg" className="shadow-lg">
                    <Link href="/dashboard/learning-lab">
                        <FlaskConical className="mr-2 h-5 w-5" /> Create Learning Lab
                    </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="bg-background shadow-md">
                    <Link href="/dashboard/tools">
                         <Sparkles className="mr-2 h-5 w-5 text-accent" /> Create Resource
                    </Link>
                </Button>
            </div>
        </div>

        {/* At-a-Glance Stats */}
        <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Students</CardTitle>
                    <Users className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{teacherData.totalStudents}</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all your classes</p>
                </CardContent>
            </Card>
             <Card className="border-l-4 border-l-green-500 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Classes</CardTitle>
                    <Book className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{teacherData.classes.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Actively managed</p>
                </CardContent>
            </Card>
             <Card className="border-l-4 border-l-orange-500 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Avg. Performance</CardTitle>
                    <Activity className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{averagePerformance}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Based on recent data</p>
                </CardContent>
            </Card>
            <Card className="bg-muted border-l-4 border-l-primary shadow-md">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Student Join Code</CardTitle>
                    <Key className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-mono font-bold text-primary">QWERTY456</div>
                    <p className="text-xs text-muted-foreground mt-1">For all Learning Labs</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Class Overview */}
            <Card className="lg:col-span-2 shadow-lg">
                 <CardHeader className="border-b bg-muted/30">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>My Classes & Performance</CardTitle>
                            <CardDescription>Visual overview of student achievement.</CardDescription>
                        </div>
                        <TrendingUp className="text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {teacherData.classes.map(classItem => (
                                <Card key={classItem.id} className="hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-primary">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-lg">{classItem.name}</h4>
                                            <Badge variant="outline">{classItem.students.length} Studs</Badge>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Progress value={classItem.performance} className="h-2 flex-1" />
                                            <span className="text-sm font-bold w-8 text-right">{classItem.performance}%</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis hide />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(0,0,0,0.05)'}}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="performance" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Student Insights Feed */}
            <Card className="flex flex-col shadow-lg border-t-4 border-t-accent">
                <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Bot className="text-primary h-6 w-6" /> Student Insights
                    </CardTitle>
                    <CardDescription>AI-generated feedback on interactions.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-[450px]">
                        <div className="space-y-6 p-6">
                             {learningSummaries.length > 0 ? learningSummaries.map((summary, index) => (
                                <div key={index} className="group flex flex-col gap-3 p-4 rounded-xl border bg-card hover:bg-muted/20 transition-colors shadow-sm">
                                     <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-primary/10">
                                             <AvatarFallback className="bg-primary/5 text-primary font-bold">{summary.studentName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-0.5">
                                            <p className="font-bold text-foreground">{summary.studentName}</p>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                Studied <Badge variant="secondary" className="text-[10px] py-0">{summary.subject}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm space-y-3 pt-2">
                                        <div className="bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                                            <h4 className="font-bold text-green-700 text-xs uppercase mb-1">Strengths:</h4>
                                            <p className="text-muted-foreground leading-relaxed">{summary.strengths}</p>
                                        </div>
                                        <div className="bg-orange-500/5 p-2 rounded-lg border border-orange-500/10">
                                             <h4 className="font-bold text-orange-700 text-xs uppercase mb-1">Areas for Growth:</h4>
                                            <p className="text-muted-foreground leading-relaxed">{summary.areasForImprovement}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 text-muted-foreground">
                                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-medium">No recent insights.</p>
                                    <p className="text-xs">Interaction feedback will appear here.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                 <CardFooter className="border-t p-4">
                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary">
                        View All Activity <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
