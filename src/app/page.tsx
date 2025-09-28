
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SyncSentaLogo } from '@/components/icons';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
             <SyncSentaLogo className="w-16 h-16 mx-auto text-primary" />
            <CardTitle className="font-headline text-3xl mt-4">Welcome to SyncSenta</CardTitle>
            <CardDescription>
              Your AI-powered partner for Kenyan education. Let's get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
              <Button onClick={() => router.push('/signup')} size="lg" className="w-full">
                  Create a Free Account
                  <ArrowRight className="ml-2" />
              </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline font-medium hover:text-primary">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <footer className="p-4 text-center text-xs text-muted-foreground">
          © 2024 SyncSenta. All rights reserved. | <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
      </footer>
    </div>
  );
}
