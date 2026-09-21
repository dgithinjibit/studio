
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
  TrendingUp,
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import type { Teacher, LearningSummary, TeacherResource } from '@/lib/types';
import { mockTeacher, mockLearningSummaries, mockRecentResources } from '@/lib/mock-data';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { generateDashboardSummary } from '@/ai/flows/generate-dashboard-summary';
import { format } from 'date-fns';

export default function TeacherDashboard() {
  const [learningSummaries, setLearningSummaries] = useState<LearningSummary[]>(mockLearningSummaries);
  const [recentResources, setRecentResources] = useState<TeacherResource[]>(mockRecentResources);
  const [teacherName, setTeacherName] = useState('Mwalimu Demo');
  const [isLoading, setIsLoading] = useState(false); // Default to false to show mock data immediately
  const [aiSummary, setAiSummary] = useState<string>('Welcome back! Your classes are showing 78% average mastery. Consider creating a new resource for Grade 4 Social Studies.');
  
  const teacherData = mockTeacher;

  useEffect(() => {
    const auth = getAuth(app);
    
    // Set initial name from local storage if available
    const storedName = localStorage.getItem('userName');
    if (storedName) setTeacherName(storedName);

    const loadAiSummary = async () => {
        try {
            const result = await generateDashboardSummary({
                classes: teacherData.classes.map(c => ({ name: c.name })),
                resources: recentResources.map(r => ({ title: r.title, type: r.type }))
            });
            if (result.summary) setAiSummary(result.summary);
        } catch (e) {
            console.warn("Failed to generate AI summary", e);
        }
    }

    loadAiSummary();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
            setTeacherName(storedName || user.displayName || 'Teacher');
            
            // Fetch real data if user is logged in
            const qResources = query(
                collection(db, "teacherResources"), 
                where("creatorId", "==", user.uid),
                orderBy("createdAt", "desc"),
                limit(5)
            );
            
            const unsubscribeResources = onSnapshot(qResources, (snapshot) => {
                if (!snapshot.empty) {
                    const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeacherResource));
                    setRecentResources(res);
                }
            });

            const qSummaries = query(
                collection(db, "learningSummaries"), 
                where("teacherId", "==", user.uid),
                orderBy("createdAt", "desc"),
                limit(10)
            );
            
            const unsubscribeSummaries = onSnapshot(qSummaries, (snapshot) => {
                if (!snapshot.empty) {
                    const summaries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningSummary));
                    setLearningSummaries(summaries);
                }
            });

            return () => {
                unsubscribeSummaries();
                unsubscribeResources();
            };
        }
    });

    return () => unsubscribeAuth();
  }, [teacherData.classes, recentResources]);

  const averagePerformance = teacherData.classes.length > 0
      ? Math.round(
          teacherData.classes.reduce((sum, c) => sum + c.performance, 0) /
          teacherData.classes.length
        )
      : 0;

  const performanceData = teacherData.classes.map(c => ({
      name: c.name.replace('Grade ', 'G'),
      performance: c.performance,
      fill: c.performance > 80 ? 'hsl(var(--chart-2))' : c.performance > 70 ? 'hsl(var(--primary))' : 'hsl(var(--chart-4))'
  }));

  const getResourceIcon = (type: string) => {
      switch(type) {
          case 'Lesson Plan': return <FileText className="h-4 w-4 text-blue-500" />;
          case 'Scheme of Work': return <Book className="h-4 w-4 text-green-500" />;
          case 'Worksheet': return <GraduationCap className="h-4 w-4 text-purple-500" />;
          default: return <FileText className="h-4 w-4 text-muted-foreground" />;
      }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
                <h1 className="text-2xl md:text-4xl font-bold font-headline text-foreground">
                    Karibu, {teacherName}
                </h1>
                <p className="text-muted-foreground text-lg">Here is your teaching summary for today, {format(new Date(), 'eeee, MMMM do')}.</p>
            </div>
            <div className="flex items-center gap-3">
                 <Button asChild size="lg" className="shadow-lg">
                    <Link href="/dashboard/learning-lab">
                        <PlusCircle className="mr-2 h-5 w-5" /> Create Learning Lab
                    </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="bg-background shadow-md">
                    <Link href="/dashboard/tools">
                         <Sparkles className="mr-2 h-5 w-5 text-accent" /> Create Resource
                    </Link>
                </Button>
            </div>
        </div>

        {/* AI Insight Bar */}
        {aiSummary && (
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                        <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-primary text-sm uppercase tracking-tight">AI Teaching Insight</h4>
                        <p className="text-foreground text-sm leading-relaxed">{aiSummary}</p>
                    </div>
                </CardContent>
            </Card>
        )}

        {/* At-a-Glance Stats */}
        <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Students</CardTitle>
                    <Users className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{teacherData.totalStudents}</div>
                    <p className="text-xs text-muted-foreground mt-1">Across all active classes</p>
                </CardContent>
            </Card>
             <Card className="border-l-4 border-l-green-500 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Classes</CardTitle>
                    <Book className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{teacherData.classes.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Assigned this term</p>
                </CardContent>
            </Card>
             <Card className="border-l-4 border-l-orange-500 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Avg. Mastery</CardTitle>
                    <Activity className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{averagePerformance}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Based on student assessments</p>
                </CardContent>
            </Card>
            <Card className="bg-muted border-l-4 border-l-primary shadow-md">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Global Join Code</CardTitle>
                    <Key className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-mono font-bold text-primary">SENTA2025</div>
                    <p className="text-xs text-muted-foreground mt-1">Share with students</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Performance & Resources */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-lg overflow-hidden">
                    <CardHeader className="border-b bg-muted/30">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Class Performance & Mastery</CardTitle>
                                <CardDescription>Mastery levels across your active CBC subjects.</CardDescription>
                            </div>
                            <TrendingUp className="text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-5 gap-6 items-center">
                            <div className="md:col-span-2 space-y-4">
                                {teacherData.classes.map(classItem => (
                                    <div key={classItem.id} className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-bold uppercase">
                                            <span>{classItem.name}</span>
                                            <span>{classItem.performance}%</span>
                                        </div>
                                        <Progress value={classItem.performance} className="h-2" />
                                    </div>
                                ))}
                            </div>
                            <div className="md:col-span-3 h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis dataKey="name" fontSize={10} fontWeight="bold" />
                                        <YAxis domain={[0, 100]} fontSize={10} />
                                        <Tooltip 
                                            cursor={{fill: 'rgba(0,0,0,0.02)'}}
                                            contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                        />
                                        <Bar dataKey="performance" radius={[4, 4, 0, 0]}>
                                            {performanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Resources */}
                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardTitle className="text-lg">Recent Resources</CardTitle>
                            <CardDescription>Quick access to your lately generated content.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/reports">View Library <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentResources.map(resource => (
                            <div key={resource.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/20 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-muted p-2 rounded-md">
                                        {getResourceIcon(resource.type)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{resource.title}</p>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {format(new Date(resource.createdAt), 'MMM do, p')}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-[10px] uppercase">{resource.type}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Student Insights Feed */}
            <Card className="flex flex-col shadow-lg border-t-4 border-t-accent h-fit">
                <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Bot className="text-primary h-6 w-6" /> Learning Labs Insight
                    </CardTitle>
                    <CardDescription>AI-generated feedback on recent student-bot interactions.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                        <div className="space-y-4 p-4">
                             {learningSummaries.length > 0 ? learningSummaries.map((summary, index) => (
                                <div key={index} className="group flex flex-col gap-3 p-4 rounded-xl border bg-card hover:bg-primary/[0.02] transition-all shadow-sm border-l-4 border-l-primary/20">
                                     <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border-2 border-primary/10">
                                                <AvatarFallback className="bg-primary/5 text-primary font-bold text-[10px]">{summary.studentName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-0.5">
                                                <p className="font-bold text-sm text-foreground">{summary.studentName}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium">{summary.subject} • {format(new Date(summary.createdAt), 'p')}</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] py-0">G{mockTeacher.classes[0].name.split(' ')[1]}</Badge>
                                    </div>
                                    
                                    <div className="text-xs space-y-3 pt-1">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-green-600 font-bold uppercase tracking-wider text-[9px]">
                                                <CheckCircle2 className="h-3 w-3" /> Strengths
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed pl-4.5 border-l border-green-500/20">{summary.strengths}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-orange-600 font-bold uppercase tracking-wider text-[9px]">
                                                <Activity className="h-3 w-3" /> Focus Area
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed pl-4.5 border-l border-orange-500/20">{summary.areasForImprovement}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 text-muted-foreground">
                                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-medium">Listening for interactions...</p>
                                    <p className="text-xs">Once students use the bot, insights appear here.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                 <CardFooter className="border-t p-4 bg-muted/5">
                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary group" asChild>
                        <Link href="/dashboard/reports">Full Activity Analytics <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
