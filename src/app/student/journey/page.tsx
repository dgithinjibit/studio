
"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit, KeyRound, Link as LinkIcon, Loader2, BookOpen, Palette, Globe, Hand, BookUser, Leaf, Sparkles, Church } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StudentHeader } from '@/components/layout/student-header';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { TeacherResource } from '@/lib/types';


type Step = 'start' | 'level' | 'sub-level' | 'grade' | 'subject';

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
    icon: string;
};

const aiSubject: Subject = { name: 'AI', icon: '/assets/ai.png' };
const blockchainSubject: Subject = { name: 'Blockchain', icon: '/assets/blockchain.png' };

const commonSubjects: Subject[] = [
    { name: 'English', icon: '/assets/english.png' },
    { name: 'Creative Arts', icon: '/assets/creative_arts.png' },
    { name: 'Indigenous Language', icon: '/assets/indigenous_language.png' },
    { name: 'Kiswahili', icon: '/assets/kiswahili.png' },
    { name: 'Kenyan Sign Language', icon: '/assets/sign_language.png' },
    { name: 'Religious Education', icon: '/assets/religious_education.png' },
    { name: 'Environmental Activities', icon: '/assets/environmental_activities.png' },
    { name: 'Creative Activities', icon: '/assets/creative_activities.png' },
];

const pastoralInstruction: Subject = { name: 'Pastoral Instruction Programme', icon: '/assets/pastoral_instruction.png' };

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
    const { toast } = useToast();
    const [step, setStep] = useState<Step>('start');
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedSubLevel, setSelectedSubLevel] = useState<string | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [studentFirstName, setStudentFirstName] = useState('Student');
    const [teacherCode, setTeacherCode] = useState('');
    const [isSubmittingCode, setIsSubmittingCode] = useState(false);

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
        localStorage.setItem('studentGrade', gradeId);
        setStep('subject');
    }, []);
    
    const handleSubjectSelect = useCallback((subjectName: string) => {
        router.push(`/student/chat/${subjectName}`);
    }, [router]);

    const handleTeacherCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!teacherCode.trim()) return;

        setIsSubmittingCode(true);

        const allResources: TeacherResource[] = JSON.parse(localStorage.getItem('teacherResources') || '[]');
        const tutorContextResource = allResources.find(r => r.id === teacherCode.trim() && r.type === 'AI Tutor Context');

        if (tutorContextResource && 'originalContent' in tutorContextResource && typeof (tutorContextResource as any).originalContent === 'string') {
            localStorage.setItem('ai_tutor_context_to_load', (tutorContextResource as any).originalContent);
            toast({
                title: "Teacher's Context Loaded!",
                description: "Launching the Classroom Compass. Your AI guide is ready.",
            });
            router.push(`/student/chat/teacher-context`);
        } else {
            toast({
                variant: 'destructive',
                title: "Invalid Code",
                description: "The code you entered does not match any AI Tutor context. Please check the code and try again.",
            });
            setIsSubmittingCode(false);
        }
    }

    const handleGoBack = useCallback(() => {
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
            setStep('start');
        } else if (step === 'start') {
            router.push('/');
        }
    }, [step, selectedLevel, router]);
    
    const renderContent = () => {
        switch (step) {
            case 'start':
                return (
                     <Card className="w-full bg-transparent border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="text-stone-800">Choose Your Path</CardTitle>
                            <CardDescription className="text-stone-600">How would you like to start your learning session today?</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                           <Card className="p-6 flex flex-col items-center justify-center text-center">
                                <LinkIcon className="w-12 h-12 text-primary mb-4" />
                                <h3 className="font-bold text-xl mb-2">Join a Teacher's Session</h3>
                                <p className="text-muted-foreground mb-4">Enter a code from your teacher to start a guided lesson with the Classroom Compass.</p>
                                <form onSubmit={handleTeacherCodeSubmit} className="w-full flex items-center gap-2">
                                    <Input 
                                        placeholder="Enter Teacher Code" 
                                        value={teacherCode} 
                                        onChange={(e) => setTeacherCode(e.target.value)} 
                                        disabled={isSubmittingCode}
                                    />
                                    <Button type="submit" size="icon" disabled={isSubmittingCode}>
                                        {isSubmittingCode ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                                    </Button>
                                </form>
                           </Card>
                            <Card className="p-6 flex flex-col items-center justify-center text-center hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => setStep('level')}>
                                <KeyRound className="w-12 h-12 text-accent mb-4" />
                                <h3 className="font-bold text-xl mb-2">Explore on Your Own</h3>
                                <p className="text-muted-foreground mb-4">Choose your grade and subject to chat with Mwalimu AI, your personal Socratic tutor.</p>
                                <Button className="w-full">
                                    Start Exploring
                                    <ArrowRight className="ml-2" />
                                </Button>
                           </Card>
                        </CardContent>
                    </Card>
                );
            case 'subject':
                 const subjects = selectedGrade ? (subjectsMap[selectedGrade] || []) : [];
                 const gradeName = `Grade ${selectedGrade?.replace('g', '')}`
                return (
                    <Card className="w-full bg-transparent border-none shadow-none">
                         <CardHeader>
                            <CardTitle className="text-stone-800">Choose Your Subject</CardTitle>
                            <CardDescription className="text-stone-600">What would you like to learn about today in {gradeName}?</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {subjects.map((subject) => (
                                <Card 
                                    key={subject.name}
                                    className="relative group overflow-hidden rounded-lg cursor-pointer aspect-square text-white"
                                    onClick={() => handleSubjectSelect(subject.name)}
                                >
                                     <Image
                                        src={subject.icon}
                                        alt={subject.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    />
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
                            <CardTitle className="text-stone-800">Pick Your Grade</CardTitle>
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
                             <CardTitle className="text-stone-800">Narrow It Down</CardTitle>
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
                            <CardTitle className="text-stone-800">Choose Your Education Level</CardTitle>
                            <CardDescription className="text-stone-600">Where are you in your learning journey?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {levels.map((level, index) => (
                                <Button 
                                    key={level.id} 
                                    className={`w-full justify-between h-14 text-lg text-white font-bold shadow-md transform transition-transform hover:scale-105 focus-scale-105 ${levelColors[index % levelColors.length]}`}
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
    
    return (
        <div className="flex flex-col w-full h-screen sm:h-[90vh] max-w-5xl mx-auto overflow-hidden bg-[#F5F5DC] sm:rounded-2xl shadow-2xl ring-1 ring-black/10">
             <StudentHeader showBackButton={step !== 'start'} onBack={handleGoBack} />
            <main className="flex-grow overflow-y-auto p-6 flex items-center">
                {renderContent()}
            </main>
        </div>
    );
}

    


