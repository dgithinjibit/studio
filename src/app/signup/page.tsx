
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EduCloudLogo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/lib/types";

const roles: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'school_head', label: 'School Head' },
    { value: 'county_officer', label: 'County Officer' },
];

export default function SignupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [role, setRole] = useState<UserRole | ''>('');
    const [step, setStep] = useState(1);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Account Created (Simulated)",
            description: "Your account has been created. You can now log in.",
        });
        router.push('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <EduCloudLogo className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Create Your EduCloud Account</CardTitle>
                    <CardDescription>Join the AI-powered education ecosystem for Kenya.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="Jina Lako" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">I am a...</Label>
                            <Select onValueChange={(value: UserRole) => setRole(value)} required>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(r => (
                                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {role === 'school_head' && (
                             <div className="space-y-2 animate-in fade-in-50">
                                <Label htmlFor="school">School</Label>
                                <Input id="school" placeholder="e.g., Nairobi School" required />
                                <p className="text-xs text-muted-foreground">Your role will be verified by an administrator.</p>
                            </div>
                        )}

                        {role === 'county_officer' && (
                            <div className="space-y-2 animate-in fade-in-50">
                                <Label htmlFor="county">County</Label>
                                <Input id="county" placeholder="e.g., Nairobi County" required />
                                <p className="text-xs text-muted-foreground">Your role will be verified by a super-administrator.</p>
                            </div>
                        )}

                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <p className="text-xs text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="underline font-medium hover:text-primary">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
