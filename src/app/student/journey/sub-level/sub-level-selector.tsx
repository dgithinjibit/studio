
"use client";

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const subLevelsMap: { [key: string]: { id: string; name: string }[] } = {
    ms: [
        { id: 'up', name: 'Upper Primary' },
        { id: 'js', name: 'Junior Secondary' },
    ],
    ss: [
        { id: 'ss', name: 'Senior School' },
    ]
    // Add other levels as needed
};


export default function SubLevelSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const level = searchParams.get('level') || '';

    const subLevels = useMemo(() => subLevelsMap[level] || [], [level]);

    const handleSubLevelSelect = (subLevelId: string) => {
        router.push(`/student/journey/grade?level=${level}&subLevel=${subLevelId}`);
    };
    
    if (!subLevels.length) {
        // This can happen if a level has no sub-levels or the param is wrong.
        // For simplicity, we can redirect to the grade selection directly.
        if (level) {
            router.replace(`/student/journey/grade?level=${level}`);
        } else {
            router.replace('/student/journey/level'); // Go back if no level
        }
        return null; // Or a loading/error state
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="font-headline text-4xl font-bold">Step 2: Narrow It Down</h1>
                    <p className="text-muted-foreground text-lg mt-2">Let's get more specific.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Select Your School Level</CardTitle>
                        <CardDescription>Which part of {level === 'ms' ? 'Middle' : 'Senior'} School are you in?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {subLevels.map((sub) => (
                            <Button
                                key={sub.id}
                                variant="outline"
                                className="w-full justify-between h-14 text-lg"
                                onClick={() => handleSubLevelSelect(sub.id)}
                            >
                                {sub.name}
                                <ArrowRight />
                            </Button>
                        ))}
                         <Button variant="link" asChild className="w-full">
                            <Link href="/student/journey/level">Go Back</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
