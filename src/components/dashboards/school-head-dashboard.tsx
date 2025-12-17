
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Users, BookOpen, BarChart3, Bell, Send, PlusCircle, ArrowRight, Wallet } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { schoolHeadConsultant } from '@/ai/flows/school-head-consultant';
import { initialTeachingStaff, initialNonTeachingStaff } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Badge } from '../ui/badge';

// Mock data that would typically be fetched from a database
const mockAnalytics = {
    totalStudents: 485,
    totalTeachers: initialTeachingStaff.length + initialNonTeachingStaff.length,
    avgPerformance: 82,
    attendanceTrend: [
        { month: "Jan", attendance: 95 },
        { month: "Feb", attendance: 96 },
        { month: "Mar", attendance: 94 },
        { month: "Apr", attendance: 92 },
        { month: "May", attendance: 93 },
        { month: "Jun", attendance: 95 },
    ]
};

const mockTransactions: Transaction[] = [
  { id: 'txn_1', date: '2024-07-30', description: 'Purchase of PP1 Textbooks', amount: 15000, category: 'Instructional Materials', status: 'Completed' },
  { id: 'txn_2', date: '2024-07-28', description: 'School Bus Fuel', amount: 8000, category: 'Transport', status: 'Completed' },
  { id: 'txn_3', date: '2024-07-25', description: 'Catering Services - PTA Meeting', amount: 25000, category: 'Events', status: 'Completed' },
];


export default function SchoolHeadDashboard() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const { toast } = useToast();
  const router = useRouter();


  const handleAskConsultant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResponse('');

    try {
        const result = await schoolHeadConsultant({
            question,
            schoolData: {
                teacherCount: mockAnalytics.totalTeachers,
                studentCount: mockAnalytics.totalStudents,
                averageAttendance: 93, 
                classes: [], 
                resources: [],
            }
        });
        setResponse(result.response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Getting Advice",
        description: "An AI error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-headline text-3xl font-bold">School Head's Dashboard</h1>
                <p className="text-muted-foreground">Operational overview and strategic tools for your school.</p>
            </div>
            <Button onClick={() => router.push('/dashboard/reports')}>
                <Send className="mr-2" />
                New Announcement
            </Button>
        </div>
        
        <Card className="lg:col-span-2">
            <form onSubmit={handleAskConsultant}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> AI Operational Consultant</CardTitle>
                <CardDescription>Ask a strategic question based on your school's data. Try: "Which class has the lowest attendance?"</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                    <div>
                    <Textarea 
                        id="consultant-question"
                        placeholder="e.g., 'Which class needs the most resources for the next term?' or 'Show me performance trends for Grade 5...'"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    </div>
                {loading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-5 h-5 animate-spin" /> 
                        <p className="text-sm">Analyzing school data...</p>
                    </div>
                )}
                {response && !loading && (
                        <div className="p-4 bg-muted/50 rounded-lg border">
                        <h4 className="font-semibold mb-2">Consultant's Advice:</h4>
                        <p className="text-sm text-foreground">{response}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={loading || !question}>
                    {loading ? <Loader2 className="mr-2 animate-spin"/> : <Sparkles className="mr-2" />}
                    {loading ? "Analyzing..." : "Ask Consultant"}
                </Button>
            </CardFooter>
            </form>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{mockAnalytics.totalStudents}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{mockAnalytics.totalTeachers}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{mockAnalytics.avgPerformance}%</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <div className="text-2xl font-bold">93%</div>
                </CardContent>
            </Card>
        </div>


        <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Users /> Staff Roster</CardTitle>
                        <CardDescription>An overview of all staff members at the school.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/school-staff')}>
                        Manage All Staff <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Category</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialTeachingStaff.slice(0, 3).map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell className="font-medium">{staff.name}</TableCell>
                                    <TableCell>{staff.role}</TableCell>
                                    <TableCell><Badge variant="secondary">{staff.category}</Badge></TableCell>
                                </TableRow>
                            ))}
                             {initialNonTeachingStaff.slice(0, 2).map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell className="font-medium">{staff.name}</TableCell>
                                    <TableCell>{staff.role}</TableCell>
                                    <TableCell><Badge>{staff.category}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2"><Wallet /> Financial Overview</CardTitle>
                     <CardDescription>A snapshot of the school's financial health.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 rounded-lg bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20 text-center">
                        <p className="text-sm">Budget Status</p>
                        <p className="text-2xl font-bold">On Track</p>
                    </div>
                     <div className="mt-4 space-y-2">
                        <h4 className="font-semibold">Recent Transactions</h4>
                        {mockTransactions.slice(0,3).map(tx => (
                            <div key={tx.id} className="text-sm flex justify-between p-2 bg-muted/50 rounded-md">
                                <span>{tx.description}</span>
                                <span className="font-mono font-medium">KES {tx.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" variant="outline" onClick={() => router.push('/dashboard/school-finance')}>
                        View Detailed Finance Management
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
    </>
  );
}
