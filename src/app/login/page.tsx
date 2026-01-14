
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
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from 'firebase/auth';
import { app, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

// Simple SVG for Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);


export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [view, setView] = useState<'login' | 'reset'>('login');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const auth = getAuth(app);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user role from Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            let role = 'student'; // Default role
            let name = user.displayName || email.split('@')[0];

            if (userDoc.exists()) {
                const userData = userDoc.data();
                role = userData.role;
                name = userData.name;
            }
            
            toast({
                title: "Login Successful",
                description: "Welcome back! Redirecting you to your dashboard.",
            });
            
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
    
    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const additionalUserInfo = getAdditionalUserInfo(result);
            const name = user.displayName || user.email!.split('@')[0];

            let role: string;

            if (additionalUserInfo?.isNewUser) {
                // If it's a new user, default them to student and create a user record
                role = 'student';
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    name: name,
                    role: role,
                    createdAt: new Date().toISOString(),
                });
            } else {
                // If user exists, fetch their role from Firestore
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    role = userDoc.data().role;
                } else {
                    // If they exist in Auth but not Firestore for some reason, create the doc
                    role = 'student';
                     await setDoc(doc(db, "users", user.uid), {
                        uid: user.uid,
                        email: user.email,
                        name: name,
                        role: role,
                        createdAt: new Date().toISOString(),
                    });
                }
            }
            
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', user.email!);
            if (role === 'student') {
                localStorage.setItem('studentName', name);
            }
             if (user.photoURL) {
                localStorage.setItem('userAvatar', user.photoURL);
            }

            await fetch('/api/set-auth-cookie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, name }),
            });

            toast({
                title: "Sign In Successful!",
                description: `Welcome, ${name}! Redirecting you now...`,
            });
            
            if (role === 'student') {
                router.push('/student/journey');
            } else {
                router.push('/dashboard');
            }

        } catch (error: any) {
             console.error("Google Sign-In Error:", error);
             toast({
                variant: "destructive",
                title: "Google Sign-In Failed",
                description: "Could not sign in with Google. Please try again.",
            });
        } finally {
            setGoogleLoading(false);
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
                            <CardContent className="space-y-4">
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
                                    <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {loading ? 'Signing In...' : 'Sign In'}
                                    </Button>
                                </form>
                                 <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading || googleLoading}>
                                    {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                                    Sign in with Google
                                </Button>
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
                © 2025 3D. All rights reserved. | <Link href="/terms" className="hover:underline">Terms & Conditions</Link> | <Link href="https://forms.gle/3vQhgtJbnEaGD6xV8" target="_blank" rel="noopener noreferrer" className="hover:underline">Provide Feedback</Link>
            </footer>
        </div>
    );
}
