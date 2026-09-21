"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, UserCog, Building, ArrowLeft, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

type Role = 'student' | 'teacher' | 'school_head' | 'county_officer';

const roles = [
    { type: 'student' as Role, title: 'I am a Student', icon: User, description: 'Join your teacher’s learning room and start your journey.' },
    { type: 'teacher' as Role, title: 'I am a Teacher', icon: Shield, description: 'Create resources and manage your classes with AI assistance.' },
    { type: 'school_head' as Role, title: 'I am a School Head', icon: UserCog, description: 'Oversee school operations and get strategic insights.' },
    { type: 'county_officer' as Role, title: 'I am a County Officer', icon: Building, description: 'Monitor county-wide educational progress and manage resources.' },
];

export default function SignupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);
    const [loadingRole, setLoadingRole] = useState<Role | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleRoleSelect = async (role: Role) => {
        setLoadingRole(role);
        
        const demoNames = {
            student: 'Demo Student',
            teacher: 'Mwalimu Demo',
            school_head: 'Headteacher Demo',
            county_officer: 'Officer Demo'
        };

        try {
            const response = await fetch('/api/set-auth-cookie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, name: demoNames[role] }),
            });

            if (response.ok) {
                localStorage.setItem('userName', demoNames[role]);
                localStorage.setItem('userRole', role);
                
                toast({
                    title: `Entering as ${demoNames[role]}`,
                    description: "Loading your workspace...",
                });

                if (role === 'student') {
                    router.push('/student/journey');
                } else {
                    router.push('/dashboard');
                }
            } else {
                throw new Error("Failed to set session.");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not start session. Please try again.",
            });
            setLoadingRole(null);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <main className="flex-grow flex items-center justify-center p-4 w-full">
                <Card className="w-full max-w-5xl relative border-none shadow-none bg-transparent">
                    <Link href="/" passHref>
                        <Button variant="ghost" size="icon" className="absolute -top-12 left-0 text-foreground">
                            <ArrowLeft className="h-5 w-5" />
                            <span className="ml-2">Back</span>
                        </Button>
                    </Link>
                    <CardHeader className="text-center pt-4">
                        <CardTitle className="font-headline text-4xl font-bold">Welcome to SyncSenta</CardTitle>
                        <CardDescription className="text-lg">Select your role to enter the platform immediately.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            const isLoading = loadingRole === role.type;
                            return (
                                <Card key={role.type} className="flex flex-col items-center text-center p-6 hover:shadow-xl hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer bg-card/50 backdrop-blur-sm" onClick={() => !loadingRole && handleRoleSelect(role.type)}>
                                    <CardHeader className="p-0">
                                        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                                          <Icon className="w-10 h-10 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{role.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow p-0 mt-4">
                                        <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
                                    </CardContent>
                                    <CardFooter className="p-0 mt-6 w-full">
                                        <Button 
                                            variant={isLoading ? "secondary" : "default"}
                                            className="w-full font-bold"
                                            disabled={!!loadingRole}
                                        >
                                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                                            {isLoading ? 'Entering...' : `Enter`}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </CardContent>
                </Card>
            </main>
             <footer className="p-6 text-center text-xs text-muted-foreground">
                © 2025 3D. All rights reserved. | <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
            </footer>
        </div>
    );
}