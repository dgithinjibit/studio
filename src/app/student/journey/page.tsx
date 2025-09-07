
"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Leaf, Wind, Palette, Languages, Church, HeartHandshake, LogOut, ArrowLeft, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ChatInterface from '../chat/[subject]/chat-interface';
import { StudentHeader } from '@/components/layout/student-header';

// Mock user data for personalization
const mockUser = {
    fullName: 'Asha Juma'
};
const studentFirstName = mockUser.fullName.split(' ')[0];

type Step = 'level' | 'sub-level' | 'grade' | 'subject' | 'chat';

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
        { name: 'English', icon: BookOpen },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: BookOpen },
        { name: 'Religious Education', icon: Church },
        { name: 'Environmental Activities', icon: Leaf },
        { name: 'Creative Activities', icon: Wind },
        { name: 'Pastoral Instruction Programme', icon: HeartHandshake },
    ],
     g4: [
        { name: 'English', icon: BookOpen },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: BookOpen },
        { name: 'Religious Education', icon: Church },
        { name: 'Environmental Activities', icon: Leaf },
        { name: 'Creative Activities', icon: Wind },
    ],
     g5: [
        { name: 'English', icon: BookOpen },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: BookOpen },
        { name: 'Religious Education', icon: Church },
        { name: 'Environmental Activities', icon: Leaf },
        { name: 'Creative Activities', icon: Wind },
    ],
     g6: [
        { name: 'English', icon: BookOpen },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: BookOpen },
        { name: 'Religious Education', icon: Church },
        { name: 'Environmental Activities', icon: Leaf },
        { name: 'Creative Activities', icon: Wind },
    ],
    g8: [
        { name: 'English', icon: BookOpen },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: BookOpen },
        { name: 'Religious Education', icon: Church },
        { name: 'Environmental Activities', icon: Leaf },
        { name: 'Creative Activities', icon: Wind },
        { name: 'Pastoral Instruction Programme', icon: HeartHandshake },
    ],
    g9: [
        { name: 'English', icon: BookOpen },
        { name: 'Creative Arts', icon: Palette },
        { name: 'Indigenous Language', icon: Languages },
        { name: 'Kiswahili/Sign Language', icon: BookOpen },
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
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const handleLevelSelect = useCallback((levelId: string) => {
        setSelectedLevel(levelId);
        if (subLevelsMap[levelId]?.length > 0) {
            setStep('sub-level');
        } else {
             setStep('grade');
        }
    }, []);
    
    const handleSubLevelSelect = useCallback((subLevelId: string) => {
        setSelectedSubLevel(subLevelId);
        setStep('grade');
    }, []);

    const handleGradeSelect = useCallback((gradeId: string) => {
        setSelectedGrade(gradeId);
        setStep('subject');
    }, []);
    
    const handleSubjectSelect = useCallback((subjectName: string) => {
        setSelectedSubject(subjectName);
        setStep('chat');
    }, []);

    const handleGoBack = useCallback(() => {
        if (step === 'chat') {
            setStep('subject');
            setSelectedSubject(null);
        } else if (step === 'subject') {
            setStep('grade');
            setSelectedSubject(null);
        } else if (step === 'grade') {
             if(selectedLevel && subLevelsMap[selectedLevel].length > 0) {
                setStep('sub-level');
            } else {
                setStep('level');
            }
            setSelectedGrade(null);
        } else if (step === 'sub-level') {
            setStep('level');
            setSelectedSubLevel(null);
        } else if (step === 'level') {
            router.push('/');
        }
    }, [step, selectedLevel, router]);

    const renderContent = () => {
        switch (step) {
            case 'chat':
                if (selectedSubject && selectedGrade) {
                    return <ChatInterface subject={selectedSubject} grade={selectedGrade} onBack={handleGoBack} />;
                }
                return null;
            case 'subject':
                 const subjects = selectedGrade ? (subjectsMap[selectedGrade] || subjectsMap['g7']) : [];
                 const gradeName = `Grade ${selectedGrade?.replace('g', '')}`
                return (
                    <Card className="w-full bg-transparent border-none shadow-none">
                         <CardHeader>
                            <CardTitle>Step 4: Choose Your Subject</CardTitle>
                            <CardDescription>What would you like to learn about today in {gradeName}?</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {subjects.map((subject) => (
                                <Card 
                                    key={subject.name}
                                    className="text-center p-6 bg-card/80 hover:bg-accent hover:border-primary transition-all cursor-pointer flex flex-col items-center justify-center aspect-square"
                                    onClick={() => handleSubjectSelect(subject.name)}
                                >
                                    <subject.icon className="w-12 h-12 text-primary mb-4" />
                                    <h3 className="font-bold text-lg">{subject.name}</h3>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                );
            case 'grade':
                const grades = selectedSubLevel ? gradesMap[selectedSubLevel] : [];
                return (
                    <Card className="w-full bg-transparent border-none shadow-none">
                        <CardHeader>
                            <CardTitle>Step 3: Pick Your Grade</CardTitle>
                            <CardDescription>Almost there! Which grade are you in?</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {grades.map((grade) => (
                                <Button key={grade.id} variant="outline" className="h-20 text-lg bg-card/80" onClick={() => handleGradeSelect(grade.id)}>
                                    {grade.name}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                );
            case 'sub-level':
                const subLevels = selectedLevel ? subLevelsMap[selectedLevel] : [];
                return (
                     <Card className="w-full bg-transparent border-none shadow-none">
                        <CardHeader>
                             <CardTitle>Step 2: Narrow It Down</CardTitle>
                             <CardDescription>Let's get more specific.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {subLevels.map((sub) => (
                                <Button key={sub.id} variant="outline" className="w-full justify-between h-14 text-lg bg-card/80" onClick={() => handleSubLevelSelect(sub.id)}>
                                    {sub.name}
                                    <ArrowRight />
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                );
            case 'level':
            default:
                return (
                    <Card className="w-full bg-transparent border-none shadow-none">
                        <CardHeader>
                            <CardTitle>Step 1: Choose Your Education Level</CardTitle>
                            <CardDescription>Where are you in your learning journey?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {levels.map((level) => (
                                <Button key={level.id} variant="outline" className="w-full justify-between h-14 text-lg bg-card/80" onClick={() => handleLevelSelect(level.id)}>
                                    {level.name}
                                    <ArrowRight />
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                );
        }
    };
    
    const showHeader = step !== 'chat';

    if (step === 'chat') {
        return (
             <div className="flex flex-col w-full h-screen sm:h-[95vh] max-w-4xl mx-auto overflow-hidden">
                <ChatInterface subject={selectedSubject!} grade={selectedGrade!} onBack={handleGoBack} />
             </div>
        )
    }

    return (
        <div className="flex flex-col w-full h-screen sm:h-[90vh] max-w-5xl mx-auto overflow-hidden bg-black/20 backdrop-blur-md sm:rounded-2xl shadow-2xl ring-1 ring-white/20">
             {showHeader && (
                 <StudentHeader showBackButton={step !== 'level'} onBack={handleGoBack} studentFirstName={studentFirstName} />
             )}
            <main className="flex-grow overflow-y-auto p-6">
                {renderContent()}
            </main>
        </div>
    );
}
