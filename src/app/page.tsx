
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Image 
            src="/sync.png" 
            alt="SyncSenta Logo"
            width={64}
            height={64}
            className="w-16 h-16 mx-auto text-primary"
            data-ai-hint="logo"
          />
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
    </div>
  );
}
