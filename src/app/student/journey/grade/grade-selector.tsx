
"use client";

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const gradesMap: { [key: string]: { [key: string]: { id: string; name: string }[] } } = {
    ms: {
        up: [
            { id: 'g4', name: 'Grade 4' },
            { id: 'g5', name: 'Grade 5' },
            { id: 'g6', name: 'Grade 6' },
        ],
        js: [
            { id: 'g7', name: 'Grade 7' },
            { id: 'g8', name: 'Grade 8' },
            { id: 'g9', name: 'Grade 9' },
        ],
    },
    ss: {
        ss: [
            { id: 'f1', name: 'Form 1' },
            { id: 'f2', name: 'Form 2' },
            { id: 'f3', name: 'Form 3' },
            { id: 'f4', name: 'Form 4' },
        ]
    }
};

export default function GradeSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const level = searchParams.get('level') || '';
    const subLevel = searchParams.get('subLevel') || '';

    const grades = useMemo(() => (gradesMap[level] && gradesMap[level][subLevel]) ? gradesMap[level][subLevel] : [], [level, subLevel]);

     const handleGradeSelect = (gradeId: string) => {
        router.push(`/student/journey/subject?grade=${gradeId}`);
    };
    
    if (!grades.length) {
         if (level) {
            router.replace(`/student/journey/subject?level=${level}`);
        } else {
            router.replace('/student/journey/level');
        }
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="font-headline text-4xl font-bold">Step 3: Pick Your Grade</h1>
                    <p className="text-muted-foreground text-lg mt-2">Almost there! Which grade are you in?</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Select Your Grade</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {grades.map((grade) => (
                             <Button
                                key={grade.id}
                                variant="outline"
                                className="h-20 text-lg"
                                onClick={() => handleGradeSelect(grade.id)}
                            >
                                {grade.name}
                            </Button>
                        ))}
                    </CardContent>
                     <CardContent>
                        <Button variant="link" asChild className="w-full mt-4">
                            <Link href={`/student/journey/sub-level?level=${level}`}>Go Back</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
