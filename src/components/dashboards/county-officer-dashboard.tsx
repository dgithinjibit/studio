
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Building2 } from "lucide-react";
import Link from 'next/link';
import SchoolMap from '@/components/school-map';
import { mockSchools } from '@/lib/mock-data';


export function CountyOfficerDashboard() {
  const [view, setView] = useState('cards');

  return (
    <>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-headline text-3xl font-bold">Welcome!</h1>
            <p className="text-muted-foreground">Oversee schools and performance in your county.</p>
          </div>
           <div className="flex items-center gap-2">
            <Button variant={view === 'cards' ? 'secondary' : 'outline'} onClick={() => setView('cards')}>
              Cards
            </Button>
            <Button variant={view === 'map' ? 'secondary' : 'outline'} onClick={() => setView('map')}>
              Map
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
                  <SchoolMap schools={mockSchools.filter(s => s.countyId === 'county_19')} />
               </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="w-6 h-6 text-accent"/> AI Tutor
                      </CardTitle>
                      <CardDescription>Start a new chat session with your AI tutor.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex items-end">
                      <Button asChild>
                          <Link href="/student/journey">Start Learning</Link>
                      </Button>
                  </CardContent>
              </Card>
               <Card className="flex flex-col">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-6 h-6 text-accent"/> School Reports
                      </CardTitle>
                      <CardDescription>View and generate reports for schools in your county.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex items-end">
                       <Button>View Reports</Button>
                  </CardContent>
              </Card>
          </div>
        )}
    </>
  );
}
