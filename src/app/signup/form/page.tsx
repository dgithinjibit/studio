
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { mockCounties } from '@/lib/mock-data';
import type { UserRole } from '@/lib/types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { signupUser } from '@/lib/auth';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';

function SignupFormComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const role = searchParams.get('role') as UserRole | null;
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!role || !termsAccepted) return;

        const formData = new FormData(event.currentTarget);
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Set localStorage on the client before calling the server action
        localStorage.setItem('userName', fullName);
        localStorage.setItem('userEmail', email);
        if (role === 'student') {
            localStorage.setItem('studentName', fullName);
        }
        
        startTransition(async () => {
            const auth = getAuth(app);
            try {
                // 1. Create user in Firebase Auth
                await createUserWithEmailAndPassword(auth, email, password);

                // 2. Call server action to set cookies and get redirect path
                const redirectPath = await signupUser(role, formData);
                
                toast({
                  title: 'Signup Successful!',
                  description: 'Redirecting you now...',
                });
                router.push(redirectPath);

            } catch (error: any) {
                console.error("Firebase signup error:", error);
                 toast({
                    variant: 'destructive',
                    title: 'Signup Failed',
                    description: error.message || 'An unexpected error occurred. Please try again.',
                });
            }
        });
    };

    const getTitle = () => {
        switch (role) {
            case 'student': return "Create Your Student Account";
            case 'teacher': return "Create Your Teacher Account";
            case 'school_head': return "Create Your School Head Account";
            case 'county_officer': return "Create Your County Officer Account";
            default: return "Create Your Account";
        }
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <main className="flex-grow flex items-center justify-center">
                <Card className="w-full max-w-lg relative">
                    <Link href="/signup" passHref>
                        <Button variant="ghost" size="icon" className="absolute top-3 left-3">
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Back to role selection</span>
                        </Button>
                    </Link>
                    <CardHeader className="text-center pt-12">
                        <CardTitle className="font-headline text-2xl">{getTitle()}</CardTitle>
                        <CardDescription>Join SyncSenta to revolutionize your learning.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" name="fullName" placeholder="Asha Juma" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" title="Please enter a valid email address." />
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

                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="terms" 
                                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                                    checked={termsAccepted}
                                />
                                <Label htmlFor="terms" className="text-xs text-muted-foreground">
                                    By creating an account, I agree to SyncSenta’s{' '}
                                    <Link href="/terms" className="underline hover:text-primary" target="_blank">
                                        Terms of Use
                                    </Link>
                                    {' '}and{' '}
                                    <Link href="/terms" className="underline hover:text-primary" target="_blank">
                                        Privacy Policy
                                    </Link>.
                                </Label>
                            </div>
                            
                            <Button type="submit" className="w-full" disabled={isPending || !termsAccepted}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPending ? 'Creating Account...' : 'Create Account'}
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
            </main>
             <footer className="p-4 text-center text-xs text-muted-foreground">
                © 2025 dantedone. All rights reserved. | <Link href="/terms" className="hover:underline">Terms & Conditions</Link> | <Link href="https://forms.gle/3vQhgtJbnEaGD6xV8" target="_blank" rel="noopener noreferrer" className="hover:underline">Provide Feedback</Link>
            </footer>
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
