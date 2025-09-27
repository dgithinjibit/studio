
"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, School, Building } from "lucide-react";
import Link from 'next/link';

type Role = 'student' | 'teacher' | 'school_head' | 'county_officer';

const roles = [
    { type: 'student' as Role, title: 'I am a Student', icon: User, description: 'Join your teacher’s learning room and start your journey.' },
    { type: 'teacher' as Role, title: 'I am a Teacher', icon: Shield, description: 'Create resources and manage your classes with AI assistance.' },
    { type: 'school_head' as Role, title: 'I am a School Head', icon: School, description: 'Get an operational overview and strategic insights for your school.' },
    { type: 'county_officer' as Role, title: 'I am a County Officer', icon: Building, description: 'Access county-wide analytics and management tools.' },
];

export default function SignupPage() {
    const router = useRouter();

    const handleRoleSelect = (role: Role) => {
        router.push(`/signup/form?role=${role}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-4xl">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl">Choose Your Role</CardTitle>
                        <CardDescription>Select the account type that best describes you.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            return (
                                <Card key={role.type} className="flex flex-col items-center text-center p-4 hover:shadow-lg hover:border-primary transition-all">
                                    <CardHeader>
                                        <div className="mx-auto bg-primary/10 p-3 rounded-full">
                                          <Icon className="w-8 h-8 text-primary" />
                                        </div>
                                        <CardTitle className="mt-4 text-lg">{role.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground">{role.description}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button onClick={() => handleRoleSelect(role.type)} className="w-full">
                                            Continue
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </CardContent>
                     <CardFooter className="flex flex-col gap-4 text-center">
                        <p className="text-xs text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="underline font-medium hover:text-primary">
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </main>
             <footer className="p-4 text-center text-xs text-muted-foreground">
                © 2024 EduCloud Kenya. All rights reserved. | <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
            </footer>
        </div>
    );
}
