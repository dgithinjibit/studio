
"use client";

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from 'lucide-react';

const roleDisplayNames: { [key: string]: string } = {
    student: 'Student',
    teacher: 'Teacher',
    school_head: 'School Head',
    county_officer: 'County Officer',
};

export default function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    
    const role = useMemo(() => searchParams.get('role') || 'student', [searchParams]);
    const roleName = useMemo(() => roleDisplayNames[role] || 'User', [role]);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Account Created!",
            description: "Let's personalize your experience.",
        });
        if (role === 'student') {
            router.push('/student/journey');
        } else {
            // Redirect other roles to their dashboard for now
            router.push('/dashboard');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-2xl">Create Your {roleName} Account</CardTitle>
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
                            <div className="relative">
                                <Input id="password" type={showPassword ? "text" : "password"} required />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

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
