
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { mockCounties } from '@/lib/mock-data';
import type { UserRole } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

function SignupFormComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const role = searchParams.get('role') as UserRole | null;

    const getTitle = () => {
        switch (role) {
            case 'student': return "Create Your Student Account";
            case 'teacher': return "Create Your Teacher Account";
            case 'school_head': return "Create Your School Head Account";
            case 'county_officer': return "Create Your County Officer Account";
            default: return "Create Your Account";
        }
    };
    
    const getRedirectPath = () => {
         switch (role) {
            case 'student': return "/student/journey";
            default: return "/dashboard";
        }
    }

    const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const fullName = formData.get('fullName') as string;

        // Persist user's name for personalization
        if (role === 'student' && fullName) {
            localStorage.setItem('studentName', fullName);
        }

        toast({
            title: "Account Created!",
            description: "Welcome! We're redirecting you now.",
        });
        router.push(getRedirectPath());
    };

    if (!role) {
        return (
             <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Invalid Role</CardTitle>
                    <CardDescription>
                        Please go back and select a role to sign up.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/signup">Back to Role Selection</Link>
                    </Button>
                </CardFooter>
             </Card>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-lg relative">
                 <Link href="/signup" passHref>
                    <Button variant="ghost" size="icon" className="absolute top-3 left-3">
                        <ArrowLeft className="h-5 w-5" />
                         <span className="sr-only">Back to role selection</span>
                    </Button>
                </Link>
                <CardHeader className="text-center pt-12">
                    <CardTitle className="font-headline text-2xl">{getTitle()}</CardTitle>
                    <CardDescription>Join SyncSenta to revolutionize your learning and teaching.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" placeholder="Asha Juma" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        
                        {role === 'county_officer' && (
                             <div className="space-y-2">
                                <Label htmlFor="county">County</Label>
                                <Select name="county" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your county" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockCounties.map(county => (
                                            <SelectItem key={county.id} value={county.id}>{county.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </form>
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
        </div>
    );
}


export default function SignupFormPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupFormComponent />
        </Suspense>
    )
}
