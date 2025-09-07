
"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { User, Shield, Briefcase, Building2, ArrowRight } from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { useRole } from '@/hooks/use-role';

const roles = [
    { name: "I'm a Student", description: "Start your interactive learning journey with AI.", icon: User, role: 'student' },
    { name: "I'm a Teacher", description: "Access AI tools to create resources and manage classes.", icon: Briefcase, role: 'teacher' },
    { name: "I'm a School Head", description: "Get operational insights and manage your institution.", icon: Building2, role: 'school_head' },
    { name: "I'm a County Officer", description: "View county-wide analytics and resource distribution.", icon: Shield, role: 'county_officer' }
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
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Choose Your Role</CardTitle>
                    <CardDescription>Select the account type that best describes you to get started.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    {roles.map(roleInfo => {
                        const Icon = roleInfo.icon;
                        return (
                            <Card 
                                key={roleInfo.role} 
                                className="p-6 hover:bg-muted/50 hover:shadow-lg transition-all cursor-pointer flex flex-col text-center items-center"
                                onClick={() => handleRoleSelection(roleInfo.role as UserRole)}
                            >
                                <Icon className="w-12 h-12 text-primary mb-4" />
                                <h3 className="font-bold text-lg">{roleInfo.name}</h3>
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
        </div>
    );
}
