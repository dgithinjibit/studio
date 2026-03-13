
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Link as LinkIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-headline font-bold">Student Launchpad</h1>
                <p className="text-muted-foreground text-lg">Welcome back! Ready to continue your learning journey?</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-2">
                            <LinkIcon className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle>Join a Teacher's Room</CardTitle>
                        <CardDescription>Enter a code from your teacher to start a guided lesson with the Classroom Compass.</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto w-full">
                        <Button asChild className="w-full">
                            <Link href="/student/journey">
                                Enter Join Code <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="mx-auto bg-accent/10 p-4 rounded-full mb-2">
                            <BrainCircuit className="w-10 h-10 text-accent" />
                        </div>
                        <CardTitle>Self-Study with Mwalimu AI</CardTitle>
                        <CardDescription>Explore any subject on your own with your personal Socratic tutor, Mwalimu AI.</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto w-full">
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/student/journey?step=level">
                                Start Exploring <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
