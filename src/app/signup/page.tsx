
"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { useRole } from '@/hooks/use-role';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const roles = [
    { name: "I'm a Student", description: "Start your interactive learning journey with AI.", role: 'student', color: 'bg-orange-500' },
    { name: "I'm a Teacher", description: "Access AI tools to create resources and manage classes.", role: 'teacher', color: 'bg-blue-500' },
    { name: "I'm a School Head", description: "Get operational insights and manage your institution.", role: 'school_head', color: 'bg-green-500' },
    { name: "I'm a County Officer", description: "View county-wide analytics and resource distribution.", role: 'county_officer', color: 'bg-purple-500' }
];


export default function SignupRoleSelectionPage() {
    const router = useRouter();
    const { setRole } = useRole();

    const handleRoleSelection = (role: UserRole) => {
        setRole(role);
        localStorage.setItem('userRole', role);
        router.push(`/signup/form?role=${role}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
             <main className="flex-grow flex items-center justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl">Choose Your Role</CardTitle>
                        <CardDescription>Select the account type that best describes you to get started.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        {roles.map(roleInfo => {
                            return (
                                <Card 
                                    key={roleInfo.role} 
                                    className="relative group overflow-hidden rounded-lg cursor-pointer flex flex-col text-center items-center p-6 text-white transition-all hover:shadow-lg hover:-translate-y-1"
                                    onClick={() => handleRoleSelection(roleInfo.role as UserRole)}
                                >
                                     <div className={cn("absolute inset-0", roleInfo.color)} />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                     <div className="relative z-10 flex flex-col items-center flex-grow">
                                        <Avatar className="h-16 w-16 mb-4 border-2 border-white/50">
                                            <AvatarFallback className="bg-white/20 text-2xl font-bold">{roleInfo.name.charAt(4).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <h3 className="font-bold text-lg mb-2">{roleInfo.name}</h3>
                                        <p className="text-sm text-white/80 mt-1 flex-grow">{roleInfo.description}</p>
                                        <Button variant="ghost" className="mt-4 text-white hover:bg-white/20 hover:text-white">
                                            Continue as {roleInfo.role.replace('_', ' ')}
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            )
                        })}
                    </CardContent>
                </Card>
            </main>
            <footer className="p-4 text-center text-xs text-muted-foreground">
                @ 2025 dantedone. All rights reserved. | <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
            </footer>
        </div>
    );
}
