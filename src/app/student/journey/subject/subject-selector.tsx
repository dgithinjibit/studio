
"use client";

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Book, Calculator, TestTube, Globe, PencilRuler, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const subjectsMap: { [key: string]: { name: string; icon: LucideIcon }[] } = {
    g7: [
        { name: 'Mathematics', icon: Calculator },
        { name: 'English', icon: Book },
        { name: 'Kiswahili', icon: Book },
        { name: 'Integrated Science', icon: TestTube },
        { name: 'Social Studies', icon: Globe },
        { name: 'Business Studies', icon: Briefcase },
        { name: 'Creative Arts', icon: PencilRuler },
    ],
    // Define subjects for other grades as needed
};

export default function SubjectSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const grade = searchParams.get('grade') || 'g7'; // Default to g7 for demo
    const gradeName = `Grade ${grade.replace('g', '')}`

    const subjects = useMemo(() => subjectsMap[grade] || subjectsMap['g7'], [grade]);

    const handleSubjectSelect = (subjectName: string) => {
        router.push(`/student/chat/${encodeURIComponent(subjectName)}?grade=${grade}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="font-headline text-4xl font-bold">Step 4: Choose Your Subject</h1>
                    <p className="text-muted-foreground text-lg mt-2">What would you like to learn about today in {gradeName}?</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Select a Subject</CardTitle>
                        <CardDescription>Pick a subject to start a chat with your AI Tutor.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {subjects.map((subject) => (
                            <Card 
                                key={subject.name}
                                className="text-center p-6 hover:bg-accent hover:border-primary transition-all cursor-pointer flex flex-col items-center justify-center aspect-square"
                                onClick={() => handleSubjectSelect(subject.name)}
                            >
                                <subject.icon className="w-12 h-12 text-primary mb-4" />
                                <h3 className="font-bold text-lg">{subject.name}</h3>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
