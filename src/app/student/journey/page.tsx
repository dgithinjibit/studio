
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, Book, Leaf, Wind, Palette, Languages, Church, HeartHandshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StudentHeader } from '@/components/layout/student-header';

type Step = 'level' | 'sub-level' | 'grade' | 'subject';

// Mock user data for personalization
const mockUser = {
    fullName: 'Asha Juma'
};
const studentFirstName = mockUser.fullName.split(' ')[0];


const levels = [
    { id: 'ms', name: 'Middle School' },
    { id: 'ss', name: 'Senior School' },
];

const subLevelsMap: { [key: string]: { id: string; name: string }[] } = {
    ms: [
        { id: 'up', name: 'Upper Primary' },
        { id: 'js', name: 'Junior Secondary' },
    ],
    ss: [] 
};

const gradesMap: { [key: string]: { id: string; name: string }[] } = {
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
};

const subjectsMap: { [key: string]: { name: string; icon: LucideIcon }[] } = {
    g7: [
        { name: 'English', icon: Book },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: Book },
        { name: 'Religious Education', icon: Church },
        { name: 'Environmental Activities', icon: Leaf },
        { name: 'Creative Activities', icon: Wind },
        { name: 'Pastoral Instruction Programme', icon: HeartHandshake },
    ],
     g4: [
        { name: 'English', icon: Book },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: Book },
        { name: 'Religious Education', icon: Church },
        { name: 'Environmental Activities', icon: Leaf },
        { name: 'Creative Activities', icon: Wind },
    ],
     g5: [
        { name: 'English', icon: Book },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: Book },
        { name: 'Religious Education', icon: Church },
        { name: 'Environmental Activities', icon: Leaf },
        { name: 'Creative Activities', icon: Wind },
    ],
     g6: [
        { name: 'English', icon: Book },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: Book },
        { name: 'Religious Education', icon: Church },
        { name: 'Environmental Activities', icon: Leaf },
        { name: 'Creative Activities', icon: Wind },
    ],
    g8: [
        { name: 'English', icon: Book },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: Book },
        { name: 'Religious Education', icon: Church },
        { name: 'Environmental Activities', icon: Leaf },
        { name: 'Creative Activities', icon: Wind },
        { name: 'Pastoral Instruction Programme', icon: HeartHandshake },
    ],
    g9: [
        { name: 'English', icon: Book },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: Book },
        { name: 'Religious Education', icon: Church },
        { name: 'Environmental Activities', icon: Leaf },
        { name: 'Creative Activities', icon: Wind },
        { name: 'Pastoral Instruction Programme', icon: HeartHandshake },
    ],
};


export default function StudentJourneyPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('level');
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedSubLevel, setSelectedSubLevel] = useState<string | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

    const handleLevelSelect = (levelId: string) => {
        setSelectedLevel(levelId);
        if (subLevelsMap[levelId]?.length > 0) {
            setStep('sub-level');
        } else {
             setStep('grade');
        }
    };
    
    const handleSubLevelSelect = (subLevelId: string) => {
        setSelectedSubLevel(subLevelId);
        setStep('grade');
    };

    const handleGradeSelect = (gradeId: string) => {
        setSelectedGrade(gradeId);
        setStep('subject');
    };
    
    const handleSubjectSelect = (subjectName: string) => {
        if (selectedGrade) {
            router.push(`/student/chat/${encodeURIComponent(subjectName)}?grade=${selectedGrade}`);
        }
    };

    const goBack = () => {
        if (step === 'subject') {
            setStep('grade');
        } else if (step === 'grade') {
            if(selectedLevel && subLevelsMap[selectedLevel].length > 0) {
                setStep('sub-level');
            } else {
                setStep('level');
            }
        } else if (step === 'sub-level') {
            setStep('level');
        } else if (step === 'level') {
            router.push('/');
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'level':
                return (
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Step 1: Choose Your Education Level</CardTitle>
                            <CardDescription>Where are you in your learning journey?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {levels.map((level) => (
                                <Button key={level.id} variant="outline" className="w-full justify-between h-14 text-lg" onClick={() => handleLevelSelect(level.id)}>
                                    {level.name}
                                    <ArrowRight />
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                );
            case 'sub-level':
                const subLevels = selectedLevel ? subLevelsMap[selectedLevel] : [];
                return (
                     <Card className="w-full">
                        <CardHeader>
                             <CardTitle>Step 2: Narrow It Down</CardTitle>
                             <CardDescription>Let's get more specific.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {subLevels.map((sub) => (
                                <Button key={sub.id} variant="outline" className="w-full justify-between h-14 text-lg" onClick={() => handleSubLevelSelect(sub.id)}>
                                    {sub.name}
                                    <ArrowRight />
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                );
            case 'grade':
                const grades = selectedSubLevel ? gradesMap[selectedSubLevel] : [];
                return (
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Step 3: Pick Your Grade</CardTitle>
                            <CardDescription>Almost there! Which grade are you in?</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {grades.map((grade) => (
                                <Button key={grade.id} variant="outline" className="h-20 text-lg" onClick={() => handleGradeSelect(grade.id)}>
                                    {grade.name}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                );
            case 'subject':
                const subjects = selectedGrade ? (subjectsMap[selectedGrade] || subjectsMap['g7']) : [];
                 const gradeName = `Grade ${selectedGrade?.replace('g', '')}`
                return (
                    <Card className="w-full">
                         <CardHeader>
                            <CardTitle>Step 4: Choose Your Subject</CardTitle>
                            <CardDescription>What would you like to learn about today in {gradeName}?</CardDescription>
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
                );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-4xl">
                 <StudentHeader 
                    showBackButton={true} 
                    onBack={goBack} 
                    studentFirstName={studentFirstName} 
                 />
                {renderStep()}
            </div>
        </div>
    );
}
