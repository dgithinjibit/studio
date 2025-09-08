
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, MapPin, Package, Bell, University } from 'lucide-react';
import type { SchoolResource, Communication, School } from '@/lib/types';
import { mockSchools } from '@/lib/mock-data';
import { generateCountySummary } from '@/ai/flows/generate-county-summary';
import { CountyResourceAllocation } from './county-resource-allocation';

const SchoolMap = dynamic(() => import('../school-map'), {
  ssr: false,
  loading: () => <div className="h-full bg-muted rounded-lg flex items-center justify-center"><Loader2 className="animate-spin" /></div>
});

export function CountyOfficerDashboard() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [resources, setResources] = useState<SchoolResource[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this data would be fetched from a database like Firestore
    const storedResources = localStorage.getItem('schoolResources');
    if (storedResources) {
      setResources(JSON.parse(storedResources));
    }
    const storedComms = localStorage.getItem('mockCommunications');
     if (storedComms) {
      setCommunications(JSON.parse(storedComms).filter((c: any) => c.recipient === 'All County Officers'));
    }
    setSchools(mockSchools);

    const handleResourceUpdate = () => {
       const updatedResources = localStorage.getItem('schoolResources');
       if (updatedResources) {
        setResources(JSON.parse(updatedResources));
      }
    };
    window.addEventListener('school-resource-update', handleResourceUpdate);
    return () => window.removeEventListener('school-resource-update', handleResourceUpdate);
  }, []);

  const handleGenerateSummary = async () => {
    setLoading(true);
    setSummary('');

    try {
        const result = await generateCountySummary({
            schoolCount: 150,
            studentCount: 45000,
            teacherCount: 1200,
            averagePerformance: 72.5,
            topPerformingSchool: 'Nyeri High School',
            lowestPerformingSchool: 'Kimathi Primary School',
            resources: resources,
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
                <h1 className="font-headline text-3xl font-bold">County Director's Dashboard</h1>
                <p className="text-muted-foreground">High-level educational overview for your county.</p>
            </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> AI Educational Analyst</CardTitle>
                    <CardDescription>Generate a strategic summary of the county's educational status.</CardDescription>
                </CardHeader>
                <CardContent>
                   {loading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5 animate-spin" /> 
                            <p className="text-sm">Analyzing county data...</p>
                        </div>
                    )}
                    {summary && !loading && (
                        <div className="prose prose-sm max-w-none">
                            <p>{summary}</p>
                        </div>
                    )}
                    {!summary && !loading && (
                        <div className="text-center text-muted-foreground p-4">
                            <p>Click the button to generate your county-wide summary and strategic suggestion.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerateSummary} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 animate-spin"/> : <Sparkles className="mr-2" />}
                        {loading ? "Generating..." : "Generate County Summary"}
                    </Button>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell className="text-primary" /> Communications</CardTitle>
                    <CardDescription>Recent announcements for your attention.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-3">
                    {communications.length > 0 ? communications.slice(0, 3).map(comm => (
                        <div key={comm.id} className="text-sm p-3 bg-muted/50 rounded-lg">
                            <p className="font-bold">{comm.title}</p>
                            <p className="text-muted-foreground text-xs">From: {comm.sender}</p>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No new communications.</p>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <CountyResourceAllocation initialResources={resources} />
            </div>

            <div className="lg:col-span-2">
                <Card className="h-[500px]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MapPin className="text-destructive" /> School Locations</CardTitle>
                        <CardDescription>Geographic distribution of schools in the county.</CardDescription>
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
