
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, MapPin, Package, Bell, University, Users, Banknote, Megaphone, Search } from 'lucide-react';
import type { SchoolResource, Communication, School } from '@/lib/types';
import { mockSchools } from '@/lib/mock-data';
import { generateCountySummary } from '@/ai/flows/generate-county-summary';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

const SchoolMap = dynamic(() => import('../school-map'), {
  ssr: false,
  loading: () => <div className="h-full bg-muted rounded-lg flex items-center justify-center"><Loader2 className="animate-spin" /></div>
});

export function CountyOfficerDashboard() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [schools, setSchools] = useState<School[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    setSchools(mockSchools);
  }, []);

  const handleGenerateSummary = async () => {
    setLoading(true);
    setSummary('');

    try {
        const result = await generateCountySummary({
            schoolCount: schools.length,
            studentCount: 45000,
            teacherCount: 1200,
            averagePerformance: 72.5,
            topPerformingSchool: 'Nyeri High School',
            lowestPerformingSchool: 'Kimathi Primary School',
            resources: [],
        });
        setSummary(`${result.summary}\n\n**Suggestion:** ${result.suggestion}`);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Summary",
        description: "An AI error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-headline text-3xl font-bold">County Administrator Dashboard</h1>
                <p className="text-muted-foreground">Strategic overview and management tools for your county.</p>
            </div>
             <Button onClick={handleGenerateSummary} disabled={loading}>
                {loading ? <Loader2 className="mr-2 animate-spin"/> : <Sparkles className="mr-2" />}
                {loading ? "Generating..." : "Generate County Summary"}
            </Button>
        </div>

        {summary && (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> AI Strategic Briefing</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm max-w-none">
                        <p>{summary}</p>
                    </div>
                </CardContent>
            </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell className="text-primary" /> Alerts & Notifications</CardTitle>
                    <CardDescription>Critical alerts from schools requiring your attention.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-3">
                    <div className="text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="font-bold text-destructive">Critically Low Attendance at Kimathi Primary</p>
                        <p className="text-muted-foreground text-xs">Weekly attendance has dropped below 70%.</p>
                    </div>
                     <div className="text-sm p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <p className="font-bold text-orange-600">Overdue Financial Report: Gachugu Academy</p>
                        <p className="text-muted-foreground text-xs">Q3 financial report is 2 weeks late.</p>
                    </div>
                 </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Megaphone className="text-primary" /> Communications Hub</CardTitle>
                    <CardDescription>Send announcements to all school administrators.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <Button className="w-full">Broadcast New Communication</Button>
                 </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Schools Management</CardTitle>
                        <CardDescription>Overview of all schools in the county. Click 'View' for a detailed drill-down.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search schools..." className="pl-8" />
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>School Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schools.slice(0, 5).map(school => (
                                    <TableRow key={school.id}>
                                        <TableCell className="font-medium">{school.name}</TableCell>
                                        <TableCell><Badge variant="outline">Active</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm">View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card className="h-[500px]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MapPin className="text-destructive" /> County School Map</CardTitle>
                        <CardDescription>Geographic distribution of schools.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <SchoolMap schools={schools} />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
