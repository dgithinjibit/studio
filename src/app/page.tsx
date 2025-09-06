
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SyncSentaLogo } from "@/components/icons";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WelcomePage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center mb-12">
            <SyncSentaLogo className="w-24 h-24 text-primary mx-auto mb-4" />
            <h1 className="font-headline text-5xl font-bold">Welcome to SyncSenta</h1>
            <p className="text-muted-foreground text-xl mt-2">Your Personal AI Learning Companion</p>
        </div>

        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Who are you?</CardTitle>
                <CardDescription className="text-center">
                    Please select your role to get started. This will tailor the experience for you.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/signup?role=student" passHref>
                   <Card className="text-center p-6 hover:bg-accent hover:border-primary transition-all cursor-pointer h-full flex flex-col justify-between">
                       <div>
                            <h3 className="font-bold text-xl mb-2">I'm a Student</h3>
                            <p className="text-muted-foreground">I want to learn, get help with homework, and chat with an AI tutor.</p>
                       </div>
                        <Button variant="ghost" className="mt-4 w-full">
                            Start Learning <ArrowRight className="ml-2"/>
                        </Button>
                   </Card>
                </Link>
                 <Link href="/signup?role=teacher" passHref>
                    <Card className="text-center p-6 hover:bg-accent hover:border-primary transition-all cursor-pointer h-full flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-xl mb-2">I'm a Teacher</h3>
                            <p className="text-muted-foreground">I want to create lesson plans, manage classes, and access resources.</p>
                        </div>
                        <Button variant="ghost" className="mt-4 w-full">
                           Get Started <ArrowRight className="ml-2"/>
                        </Button>
                    </Card>
                </Link>
            </CardContent>
        </Card>
    </div>
  );
}
