
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Library, Users } from "lucide-react";
import Link from "next/link";
import { SyncSentaLogo } from '@/components/icons';
import Image from 'next/image';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="absolute top-0 left-0 right-0 p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
                <SyncSentaLogo className="w-8 h-8 text-primary" />
                <h1 className="font-headline text-xl font-bold text-foreground">SyncSenta</h1>
            </div>
             <Button variant="ghost" asChild>
                <Link href="/login">
                  Sign In
                </Link>
            </Button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-6 text-center md:text-left">
                    <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-foreground">
                        The Future of Kenyan Education, <span className="text-primary">Powered by AI</span>
                    </h1>
                    <p className="max-w-lg mx-auto md:mx-0 text-lg text-muted-foreground">
                        SyncSenta is your AI partner for CBC-aligned teaching resources, personalized student learning, and powerful school management tools.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button onClick={() => router.push('/signup')} size="lg" className="w-full sm:w-auto">
                            Get Started for Free
                            <ArrowRight className="ml-2" />
                        </Button>
                    </div>

                    <div className="space-y-6 pt-8">
                       <FeatureCard 
                            icon={<Bot />}
                            title="AI Teacher Tools"
                            description="Generate lesson plans, schemes of work, and rubrics in minutes."
                       />
                       <FeatureCard 
                            icon={<Users />}
                            title="Student Learning Lab"
                            description="Create custom AI tutors for engaging, personalized student practice."
                       />
                       <FeatureCard 
                            icon={<Library />}
                            title="My Library & Reports"
                            description="Organize all your generated resources and track student progress."
                       />
                    </div>
                </div>

                {/* Right Column - Image */}
                <div className="relative hidden md:flex items-center justify-center">
                    <div className="absolute w-72 h-72 bg-primary/20 rounded-full blur-3xl -translate-x-12"></div>
                    <div className="absolute w-72 h-72 bg-accent/20 rounded-full blur-3xl translate-x-12"></div>
                     <Image
                        src="/assets/kenyan-classroom.png"
                        alt="A modern Kenyan classroom with students and a teacher using technology"
                        width={550}
                        height={550}
                        className="rounded-xl object-contain"
                        priority
                    />
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

