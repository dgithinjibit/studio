
"use client";

import { Button } from "@/components/ui/button";
import { SyncSentaLogo } from "@/components/icons";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WelcomePage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center max-w-3xl">
            <SyncSentaLogo className="w-24 h-24 text-primary mx-auto mb-6" />
            <h1 className="font-headline text-5xl md:text-6xl font-bold">Welcome to <span className="text-primary">SyncSenta</span></h1>
            <p className="text-muted-foreground text-lg md:text-xl mt-4">
              Kenya&apos;s first AI-powered education platform that works offline. Personalized learning for students, powerful tools for teachers, and data-driven insights for administrators.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                    <Link href="/login">Sign In</Link>
                </Button>
            </div>
        </div>
    </div>
  );
}
