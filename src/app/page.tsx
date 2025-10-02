
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="absolute top-0 left-0 right-0 p-4">
        <div className="container mx-auto flex justify-end items-center">
             <Button variant="ghost" asChild>
                <Link href="/login">
                  Sign In
                </Link>
            </Button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
                <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-foreground">
                    SyncSenta
                </h1>
                <p className="max-w-2xl text-2xl md:text-3xl text-primary font-semibold">
                    The Future of Kenyan Education, Powered by AI
                </p>
                <p className="max-w-xl text-muted-foreground text-lg">
                    Your AI partner for CBC-aligned teaching resources, personalized student learning, and powerful school management tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => router.push('/signup')} size="lg" className="w-full sm:w-auto">
                        Get Started for Free
                        <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
      </main>
       <footer className="p-4 text-center text-xs text-muted-foreground">
          © 2025 dantedone. All rights reserved. | <Link href="/terms" className="hover:underline">Terms & Conditions</Link> | <Link href="https://forms.gle/3vQhgtJbnEaGD6xV8" target="_blank" rel="noopener noreferrer" className="hover:underline">Provide Feedback</Link>
      </footer>
    </div>
  );
}
