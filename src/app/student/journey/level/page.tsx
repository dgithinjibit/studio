
"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const levels = [
    { id: 'eyl', name: 'Early Years Education' },
    { id: 'ms', name: 'Middle School' },
    { id: 'ss', name: 'Senior School' },
];

export default function SelectLevelPage() {
    const router = useRouter();

    const handleLevelSelect = (levelId: string) => {
        router.push(`/student/journey/sub-level?level=${levelId}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="font-headline text-4xl font-bold">Meet Mwalimu AI 🦉</h1>
                    <p className="text-muted-foreground text-lg mt-2">
                        I’m your friendly Socratic Mentor. I'm here to guide you through learning by asking questions that spark your curiosity and help you discover answers on your own.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Step 1: Choose Your Education Level</CardTitle>
                        <CardDescription>To get started, where are you in your learning journey?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {levels.map((level) => (
                            <Button
                                key={level.id}
                                variant="outline"
                                className="w-full justify-between h-14 text-lg"
                                onClick={() => handleLevelSelect(level.id)}
                            >
                                {level.name}
                                <ArrowRight />
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
