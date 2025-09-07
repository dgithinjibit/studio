
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Building2, Bot, Sparkles, Send } from "lucide-react";
import Link from 'next/link';
import SchoolMap from '@/components/school-map';
import { mockSchools } from '@/lib/mock-data';
import { generateCountySummary } from '@/ai/flows/generate-county-summary';
import { useToast } from '@/hooks/use-toast';


export function CountyOfficerDashboard() {
  const [view, setView] = useState('cards');
  const [summary, setSummary] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
      setIsLoading(true);
      setSummary('');
      setSuggestion('');
      try {
          const result = await generateCountySummary({
              schoolCount: 13,
              studentCount: 8500,
              teacherCount: 250,
              averagePerformance: 78,
              topPerformingSchool: 'Alliance High School',
              lowestPerformingSchool: 'Gachugu Academy'
          });
          setSummary(result.summary);
          setSuggestion(result.suggestion);
      } catch (error) {
          console.error('Error generating county summary', error);
          toast({
              variant: 'destructive',
              title: 'Error Generating Summary',
              description: 'Could not connect to the AI service. Please try again later.'
          })
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-3xl font-bold">Welcome, County Director!</h1>
            <p className="text-muted-foreground">Oversee schools and performance in your county.</p>
          </div>
           <div className="flex items-center gap-2">
            <Button variant={view === 'cards' ? 'secondary' : 'outline'} onClick={() => setView('cards')}>
              Dashboard
            </Button>
            <Button variant={view === 'map' ? 'secondary' : 'outline'} onClick={() => setView('map')}>
              Map View
            </Button>
          </div>
        </div>
        
        {view === 'map' ? (
          <Card>
            <CardHeader>
              <CardTitle>School Map</CardTitle>
              <CardDescription>Visualizing all schools in the county.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="h-[600px] w-full">
                  <SchoolMap schools={mockSchools.filter(s => s.countyId === 'county_19' || s.countyId === 'county_22' || s.countyId === 'county_47')} />
               </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Bot className="w-6 h-6 text-primary" />
                        AI County Analyst
                    </CardTitle>
                    <CardDescription>
                        Generate a high-level summary and strategic suggestions based on the latest county-wide data.
                    </CardDescription>
                </CardHeader>
                {(summary || suggestion) && !isLoading && (
                    <CardContent className="space-y-4">
                        {summary && (
                             <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">County-Wide Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{summary}</p>
                                </CardContent>
                            </Card>
                        )}
                        {suggestion && (
                             <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Strategic Suggestion</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">{suggestion}</p>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                )}
                 {isLoading && (
                    <CardContent>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                            <p>Analyzing county data and generating insights...</p>
                        </div>
                    </CardContent>
                )}
                <CardFooter>
                    <Button onClick={handleGenerateSummary} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                             <>
                                <Send className="mr-2 h-4 w-4" />
                                Analyze County Performance
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-6 h-6 text-accent"/> School Reports
                        </CardTitle>
                        <CardDescription>View detailed reports and performance data for individual schools in your county.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end">
                        <Button>View School-Specific Reports</Button>
                    </CardContent>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-6 h-6 text-accent"/> Resource Allocation
                        </CardTitle>
                        <CardDescription>Analyze resource distribution and needs across all schools.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end">
                        <Button>Analyze Resources</Button>
                    </CardContent>
                </Card>
            </div>
          </div>
        )}
    </>
  );
}
