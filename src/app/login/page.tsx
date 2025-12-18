
"use client";

import { useState } from 'react';
import { useRouter }from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '@/lib/firebase';


export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [view, setView] = useState<'login' | 'reset'>('login');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const auth = getAuth(app);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            
            toast({
                title: "Login Successful",
                description: "Welcome back! Redirecting you to your dashboard.",
            });

            const role = email.includes('teacher') ? 'teacher' : email.includes('head') ? 'school_head' : 'student';
            const name = email.split('@')[0];
            
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);

            await fetch('/api/set-auth-cookie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, name }),
            });
            
            if (role === 'student') {
                router.push('/student/journey');
            } else {
                router.push('/dashboard');
            }

        } catch (error: any) {
            console.error("Firebase Auth Error:", error);
            let description = "An unexpected error occurred. Please try again.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                description = "Invalid email or password. Please check your credentials and try again.";
            }
            toast({
                variant: "destructive",
                title: "Login Failed",
                description,
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const auth = getAuth(app);

        try {
            await sendPasswordResetEmail(auth, email);
            toast({
                title: "Password Reset Email Sent",
                description: "Check your inbox for a link to reset your password. If you don't see it, please check your spam folder.",
            });
            setView('login'); // Go back to login view
        } catch (error: any) {
             console.error("Password Reset Error:", error);
             toast({
                variant: "destructive",
                title: "Reset Failed",
                description: error.code === 'auth/user-not-found' ? "No account found with that email address." : "An error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <main className="flex-grow flex items-center justify-center">
                <Card className="w-full max-w-sm">
                    {view === 'login' ? (
                        <>
                            <CardHeader className="text-center">
                                <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-primary">
                                    SyncSenta
                                </h1>
                                <CardTitle className="font-headline text-2xl pt-4">Welcome Back</CardTitle>
                                <CardDescription>Enter your credentials to access your account.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            placeholder="teacher@syncsenta.com" 
                                            required 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                            <Button variant="link" type="button" onClick={() => setView('reset')} className="h-auto p-0 text-xs">
                                                Forgot Password?
                                            </Button>
                                        </div>
                                        <div className="relative">
                                            <Input 
                                                id="password" 
                                                type={showPassword ? "text" : "password"} 
                                                required 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </Button>
                                </form>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <p className="text-xs text-muted-foreground">
                                    Don't have an account?{' '}
                                    <Link href="/signup" className="underline font-medium hover:text-primary">
                                        Choose a role
                                    </Link>
                                </p>
                            </CardFooter>
                        </>
                    ) : (
                        <>
                             <CardHeader className="text-center">
                                <CardTitle className="font-headline text-2xl">Reset Password</CardTitle>
                                <CardDescription>Enter your email to receive a password reset link.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordReset} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reset-email">Email</Label>
                                        <Input 
                                            id="reset-email" 
                                            type="email" 
                                            placeholder="Your account email" 
                                            required 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                                        Send Reset Link
                                    </Button>
                                </form>
                            </CardContent>
                            <CardFooter>
                                 <Button variant="link" onClick={() => setView('login')} className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Sign In
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </main>
             <footer className="p-4 text-center text-xs text-muted-foreground">
                © 2025 dantedone. All rights reserved. | <Link href="/terms" className="hover:underline">Terms & Conditions</Link> | <Link href="https://forms.gle/3vQhgtJbnEaGD6xV8" target="_blank" rel="noopener noreferrer" className="hover:underline">Provide Feedback</Link>
            </footer>
        </div>
    );
}
