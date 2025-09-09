"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight } from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { useRole } from '@/hooks/use-role';
import Link from 'next/link';
import Image from 'next/image';

const roles = [
    { name: "I'm a Student", description: "Start your interactive learning journey with AI.", role: 'student', icon: '/assets/stud.png' },
    { name: "I'm a Teacher", description: "Access AI tools to create resources and manage classes.", role: 'teacher', icon: '/assets/teach.png' },
    { name: "I'm a School Head", description: "Get operational insights and manage your institution.", role: 'school_head', icon: 'Shield' },
    { name: "I'm a County Officer", description: "View county-wide analytics and resource distribution.", role: 'county_officer', icon: '/assets/countydir.png' }
];

const renderIcon = (icon: string) => {
    if (icon.startsWith('/assets/')) {
        return <Image src={icon} alt="" width={48} height={48} className="mb-4" />;
    }
    // For now, only Shield is a non-path icon
    if (icon === 'Shield') {
        return <Shield className="w-12 h-12 text-primary mb-4" />;
    }
    return null;
}


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
                                    className="p-6 hover:bg-muted/50 hover:shadow-lg transition-all cursor-pointer flex flex-col text-center items-center"
                                    onClick={() => handleRoleSelection(roleInfo.role as UserRole)}
                                >
                                    {renderIcon(roleInfo.icon)}
                                    <h3 className="font-bold text-lg mb-2">{roleInfo.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 flex-grow">{roleInfo.description}</p>
                                    <Button variant="ghost" className="mt-4 text-primary">
                                        Continue as {roleInfo.role.replace('_', ' ')}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
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
