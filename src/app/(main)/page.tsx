"use client";

import { useState } from 'react';
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/use-role";
import { Lightbulb, WifiOff, Users, BarChart2, FolderKanban } from "lucide-react";
import { GenerateLessonPlanDialog } from '@/components/generate-lesson-plan-dialog';

export default function DashboardPage() {
  const { role } = useRole();
  const [isLessonPlanDialogOpen, setIsLessonPlanDialogOpen] = useState(false);

  const getWelcomeMessage = () => {
    switch (role) {
      case 'student': return "Welcome, Student!";
      case 'teacher': return "Welcome, Teacher!";
      case 'school_head': return "School Administration Dashboard";
      case 'county_officer': return "County Education Overview";
      default: return "Welcome to EduCloud Kenya";
    }
  };

  const getRoleDescription = () => {
     switch (role) {
      case 'student': return "Access your assignments, and view your progress reports.";
      case 'teacher': return "Manage your classes, assignments, and access curriculum materials.";
      case 'school_head': return "Oversee school-wide performance and manage users.";
      case 'county_officer': return "Monitor educational metrics across the county.";
      default: return "The AI-powered Kenyan education ecosystem.";
    }
  }

  return (
    <>
      <AppHeader title="Dashboard" />
      <main className="flex-1 p-4 md:p-6">
        <GenerateLessonPlanDialog open={isLessonPlanDialogOpen} onOpenChange={setIsLessonPlanDialogOpen} />
        <div className="mb-6">
            <h1 className="font-headline text-3xl font-bold">{getWelcomeMessage()}</h1>
            <p className="text-muted-foreground">{getRoleDescription()}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {role === 'teacher' && (
                 <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Lightbulb className="w-6 h-6 text-accent"/> AI Lesson Planner
                        </CardTitle>
                        <CardDescription>Generate a draft lesson plan in seconds using AI.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end">
                        <Button onClick={() => setIsLessonPlanDialogOpen(true)}>Generate Lesson Plan</Button>
                    </CardContent>
                </Card>
            )}

             {role === 'school_head' && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Users className="w-6 h-6 text-accent"/> User Management
                        </CardTitle>
                        <CardDescription>Assign and manage roles for students, teachers, and staff.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">4 active users need role verification.</p>
                    </CardContent>
                </Card>
            )}

            {role === 'county_officer' && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <BarChart2 className="w-6 h-6 text-accent"/> County-Wide Reports
                        </CardTitle>
                        <CardDescription>Access aggregated reports for schools in your jurisdiction.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">New Q3 performance reports are available.</p>
                    </CardContent>
                </Card>
            )}

            {role === 'student' && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <FolderKanban className="w-6 h-6 text-accent"/> My Assignments
                        </CardTitle>
                        <CardDescription>You have 2 assignments due this week.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">Submit your Algebra homework by Friday.</p>
                    </CardContent>
                </Card>
            )}
            
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <WifiOff className="w-6 h-6 text-accent"/> Offline Data Synchronization
                    </CardTitle>
                    <CardDescription>Our strategy for low-bandwidth environments.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p>EduCloud Kenya is designed for reliability, even with intermittent internet. Data like attendance, lesson plans, and drafts are saved locally in your browser.</p>
                    <p>When you're back online, the app automatically syncs your data with Cloud Storage. We use smart conflict resolution to ensure data integrity. This process is optimized to use minimal bandwidth, making it ideal for the Kenyan context.</p>
                    <p className="font-bold text-muted-foreground text-xs pt-2">TECHNICAL NOTE: This is achieved using Service Workers for background sync and IndexedDB/localStorage for client-side storage.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Secure by Design</CardTitle>
                    <CardDescription>Role-Based Access Control</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                    <p>Your data is protected. Access to files like curriculum, assignments, and reports is strictly controlled based on your role (Student, Teacher, etc.), enforced by Firebase Security Rules on the backend.</p>
                </CardContent>
            </Card>

        </div>
      </main>
    </>
  );
}
