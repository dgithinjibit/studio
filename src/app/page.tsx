
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

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
            <div className="flex flex-col items-center justify-center text-center space-y-8">
                
                <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                    <Image
                      src="/assets/LOGO.png"
                      alt="SyncSenta Logo"
                      width={160}
                      height={160}
                      className="rounded-full"
                    />
                </div>
                
                <div className="max-w-2xl space-y-4">
                    <p className="text-xl md:text-2xl text-foreground font-semibold">
                        SyncSenta is an AI-powered operating system designed to synchronize the Kenyan education ecosystem.
                    </p>
                    <p className="text-lg text-muted-foreground">
                        We connect students, teachers, and administrators to streamline workflows and foster critical thinking, all grounded in the official curriculum.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Button onClick={() => router.push('/signup')} size="lg" className="w-full sm:w-auto">
                        Get Started
                        <ArrowRight className="ml-2" />
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/products">
                            View Products
                        </Link>
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
