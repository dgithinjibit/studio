
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SignupPage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-center">To begin, who are you?</CardTitle>
                <CardDescription className="text-center text-lg">
                    Please select your role to personalize your journey.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/signup/form?role=student" passHref>
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
                 <Link href="/signup/form?role=teacher" passHref>
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
                <Link href="/signup/form?role=school_head" passHref>
                    <Card className="text-center p-6 hover:bg-accent hover:border-primary transition-all cursor-pointer h-full flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-xl mb-2">I'm a School Head</h3>
                            <p className="text-muted-foreground">I manage a school and need to track teacher and student progress.</p>
                        </div>
                        <Button variant="ghost" className="mt-4 w-full">
                           Manage School <ArrowRight className="ml-2"/>
                        </Button>
                    </Card>
                </Link>
                <Link href="/signup/form?role=county_officer" passHref>
                    <Card className="text-center p-6 hover:bg-accent hover:border-primary transition-all cursor-pointer h-full flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-xl mb-2">I'm a County Officer</h3>
                            <p className="text-muted-foreground">I oversee schools in a county and need to view performance data.</p>
                        </div>
                        <Button variant="ghost" className="mt-4 w-full">
                           View Reports <ArrowRight className="ml-2"/>
                        </Button>
                    </Card>
                </Link>
            </CardContent>
             <CardContent className="text-center text-sm text-muted-foreground">
                <p>
                    Already have an account?{' '}
                    <Link href="/login" className="underline font-medium hover:text-primary">
                        Sign In
                    </Link>
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
