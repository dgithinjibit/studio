
"use client";

import { useState } from 'react';
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <>
      <AppHeader title="Dashboard" />
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
            <h1 className="font-headline text-3xl font-bold">Welcome!</h1>
            <p className="text-muted-foreground">This is your new dashboard.</p>
        </div>

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
                        <Link href="/student/journey/level">Start Learning</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
