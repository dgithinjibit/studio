
"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, HeartHandshake, LogOut, ArrowLeft, User, Palette, Languages, BookOpen, Church, BrainCircuit } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ChatInterface from '../chat/chat-interface';
import { StudentHeader } from '@/components/layout/student-header';
import Image from 'next/image';
import { BlockchainCurriculumDisplay } from '@/components/blockchain-curriculum-display';
import { AiIcon } from '@/components/icons';

type Step = 'level' | 'sub-level' | 'grade' | 'subject' | 'chat' | 'content';

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
        { id: 'g9', 'name': 'Grade 9' },
    ],
};

type Subject = {
    name: string;
    icon: LucideIcon | string;
};

const aiSubject: Subject = { name: 'AI', icon: AiIcon };
const blockchainSubject: Subject = { name: 'Blockchain', icon: BrainCircuit };

const commonSubjects: Subject[] = [
    { name: 'English', icon: '/assets/english-icon.png' },
    { name: 'Creative Arts', icon: '/assets/creative_arts.png' },
    { name: 'Indigenous Language', icon: '/assets/indig.png' },
    { name: 'Kiswahili', icon: '/assets/kisw.png' },
    { name: 'Kenyan Sign Language', icon: '/assets/ksl.png' },
    { name: 'Religious Education', icon: '/assets/cre.png' },
    { name: 'Environmental Activities', icon: '/assets/envr.png' },
    { name: 'Creative Activities', icon: '/assets/creative_act.png' },
];

const pastoralInstruction = { name: 'Pastoral Instruction Programme', icon: HeartHandshake };

const subjectsMap: { [key: string]: Subject[] } = {
    g4: [...commonSubjects, aiSubject, blockchainSubject],
    g5: [...commonSubjects, aiSubject, blockchainSubject],
    g6: [...commonSubjects, aiSubject, blockchainSubject],
    g7: [...commonSubjects, pastoralInstruction, aiSubject, blockchainSubject],
    g8: [...commonSubjects, pastoralInstruction, aiSubject, blockchainSubject],
    g9: [...commonSubjects, pastoralInstruction, aiSubject, blockchainSubject],
};

const levelColors = ["bg-teal-500", "bg-amber-500"];
const subLevelColors = ["bg-blue-500", "bg-green-500"];
const gradeColors = ["bg-orange-500", "bg-lime-600", "bg-cyan-500", "bg-rose-500", "bg-indigo-500", "bg-pink-500"];

export default function StudentJourneyPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('level');
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedSubLevel, setSelectedSubLevel] = useState<string | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [studentFirstName, setStudentFirstName] = useState('Student');

    useEffect(() => {
        const name = localStorage.getItem('studentName');
        if (name) {
            setStudentFirstName(name.split(' ')[0]);
        }
    }, []);

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
        if (subjectName === 'Blockchain') {
            setStep('content');
        } else {
            setStep('chat');
        }
    }, []);

    const handleGoBack = useCallback(() => {
        if (step === 'chat' || step === 'content') {
            setSelectedSubject(null);
            setStep('subject');
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
    
    const renderIcon = (icon: LucideIcon | string, subjectName: string) => {
        if (typeof icon === 'string') {
            return <Image src={icon} alt={`${subjectName} icon`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />;
        }
        const IconComponent = icon;
        return (
            <div className="flex items-center justify-center w-full h-full bg-card">
                 <IconComponent className="w-24 h-24 text-primary" />
            </div>
        )
    };

    const renderContent = () => {
        switch (step) {
            case 'content':
                return <BlockchainCurriculumDisplay onBack={handleGoBack} />;
            case 'chat':
                if (selectedSubject && selectedGrade) {
                    return <ChatInterface subject={selectedSubject} grade={selectedGrade} onBack={handleGoBack} />;
                }
                return null;
            case 'subject':
                 const subjects = selectedGrade ? (subjectsMap[selectedGrade] || []) : [];
                 const gradeName = `Grade ${selectedGrade?.replace('g', '')}`
                return (
                    <Card className="w-full bg-transparent border-none shadow-none">
                         <CardHeader>
                            <CardTitle className="text-stone-800">Step 4: Choose Your Subject</CardTitle>
                            <CardDescription className="text-stone-600">What would you like to learn about today in {gradeName}?</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {subjects.map((subject) => (
                                <Card 
                                    key={subject.name}
                                    className="relative group overflow-hidden rounded-lg cursor-pointer aspect-square text-white"
                                    onClick={() => handleSubjectSelect(subject.name)}
                                >
                                    {renderIcon(subject.icon, subject.name)}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="font-bold text-lg opacity-50 group-hover:opacity-100 transition-opacity">{subject.name}</h3>
                                    </div>
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
                            <CardTitle className="text-stone-800">Step 3: Pick Your Grade</CardTitle>
                            <CardDescription className="text-stone-600">Almost there! Which grade are you in?</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {grades.map((grade, index) => (
                                <Button 
                                    key={grade.id} 
                                    className={`h-20 text-lg text-white font-bold text-shadow-sm shadow-lg transform transition-transform hover:scale-105 focus:scale-105 ${gradeColors[index % gradeColors.length]}`}
                                    onClick={() => handleGradeSelect(grade.id)}
                                >
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
                             <CardTitle className="text-stone-800">Step 2: Narrow It Down</CardTitle>
                             <CardDescription className="text-stone-600">Let's get more specific.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {subLevels.map((sub, index) => (
                                <Button 
                                    key={sub.id} 
                                    className={`w-full justify-between h-14 text-lg text-white font-bold shadow-md transform transition-transform hover:scale-105 focus:scale-105 ${subLevelColors[index % subLevelColors.length]}`}
                                    onClick={() => handleSubLevelSelect(sub.id)}
                                >
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
                            <CardTitle className="text-stone-800">Step 1: Choose Your Education Level</CardTitle>
                            <CardDescription className="text-stone-600">Where are you in your learning journey?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {levels.map((level, index) => (
                                <Button 
                                    key={level.id} 
                                    className={`w-full justify-between h-14 text-lg text-white font-bold shadow-md transform transition-transform hover:scale-105 focus:scale-105 ${levelColors[index % levelColors.length]}`}
                                    onClick={() => handleLevelSelect(level.id)}
                                >
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

    if (step === 'chat' || step === 'content') {
        return (
             <div className="flex flex-col w-full h-screen sm:h-[95vh] max-w-4xl mx-auto overflow-hidden">
                {step === 'chat' && <ChatInterface subject={selectedSubject!} grade={selectedGrade!} onBack={handleGoBack} />}
                {step === 'content' && <BlockchainCurriculumDisplay onBack={handleGoBack} />}
             </div>
        )
    }

    return (
        <div className="flex flex-col w-full h-screen sm:h-[90vh] max-w-5xl mx-auto overflow-hidden bg-[#F5F5DC] sm:rounded-2xl shadow-2xl ring-1 ring-black/10">
             {showHeader && (
                 <StudentHeader showBackButton={step !== 'level'} onBack={handleGoBack} studentFirstName={studentFirstName} />
             )}
            <main className="flex-grow overflow-y-auto p-6">
                {renderContent()}
            </main>
        </div>
    );
}
