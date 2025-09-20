
"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit, KeyRound, Link as LinkIcon, Loader2 } from 'lucide-react';
import { StudentHeader } from '@/components/layout/student-header';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { TeacherResource } from '@/lib/types';
import { levels, subLevelsMap, gradesMap, subjectsMap, Step } from '@/lib/journey-data';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, storage } from '@/lib/firebase';
import { ref, getBytes } from 'firebase/storage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


export default function StudentJourneyPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [stepHistory, setStepHistory] = useState<Step[]>(['start']);
    const currentStep = stepHistory[stepHistory.length - 1];
    
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

    const navigateTo = (newStep: Step) => {
        setStepHistory(prev => [...prev, newStep]);
    };

    const handleGoBack = useCallback(() => {
        if (stepHistory.length > 1) {
            setStepHistory(prev => prev.slice(0, -1));
        } else {
            router.push('/');
        }
    }, [stepHistory.length, router]);

    const handleLevelSelect = useCallback((levelId: string) => {
        setSelectedLevel(levelId);
        navigateTo(subLevelsMap[levelId]?.length > 0 ? 'sub-level' : 'grade');
    }, []);
    
    const handleSubLevelSelect = useCallback((subLevelId: string) => {
        setSelectedSubLevel(subLevelId);
        navigateTo('grade');
    }, []);

    const handleGradeSelect = useCallback((gradeId: string) => {
        setSelectedGrade(gradeId);
        localStorage.setItem('studentGrade', gradeId);
        navigateTo('subject');
    }, []);

    const handleTeacherCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teacherCode.trim()) return;

        setIsSubmittingCode(true);

        try {
            const q = query(collection(db, "teacherResources"), where("joinCode", "==", teacherCode.trim()));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const tutorContextResource = doc.data() as TeacherResource;

                // The URL in Firestore is the full download URL, we need the path
                const storageRef = ref(storage, tutorContextResource.url);
                const bytes = await getBytes(storageRef);
                const contextText = new TextDecoder().decode(bytes);

                localStorage.setItem('ai_tutor_context_to_load', contextText);
                localStorage.setItem('ai_tutor_room_id', tutorContextResource.joinCode);
                
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
            }
        } catch (error) {
             toast({
                variant: 'destructive',
                title: "Error Loading Context",
                description: "Could not load the teacher's materials. Please try again.",
            });
            console.error("Error handling teacher code:", error);
        } finally {
            setIsSubmittingCode(false);
        }
    }
    
    const renderContent = () => {
        switch (currentStep) {
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
                                        onChange={(e) => setTeacherCode(e.target.value.toUpperCase())} 
                                        disabled={isSubmittingCode}
                                        maxLength={7}
                                        className="uppercase tracking-widest font-mono text-center"
                                    />
                                    <Button type="submit" size="icon" disabled={isSubmittingCode || teacherCode.length < 6}>
                                        {isSubmittingCode ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                                    </Button>
                                </form>
                           </Card>
                            <Card className="p-6 flex flex-col items-center justify-center text-center hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => navigateTo('level')}>
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
                           {subjects.map((subject, index) => (
                                <Link key={subject.name} href={`/student/chat/${encodeURIComponent(subject.name)}`} passHref>
                                    <Card 
                                        className="group overflow-hidden rounded-lg cursor-pointer aspect-square text-white flex flex-col justify-end p-4 transition-all hover:shadow-lg bg-card"
                                    >
                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <Image 
                                                src={subject.icon} 
                                                alt={`${subject.name} icon`} 
                                                width={64} 
                                                height={64} 
                                                className="h-16 w-16 mb-2 object-contain" 
                                            />
                                            <h3 className="font-bold text-lg text-foreground">{subject.name}</h3>
                                        </div>
                                    </Card>
                                </Link>
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
                                    className={`h-20 text-lg text-white font-bold text-shadow-sm shadow-lg transform transition-transform hover:scale-105 focus:scale-105 bg-blue-500`}
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
                                    className={`w-full justify-between h-14 text-lg text-white font-bold shadow-md transform transition-transform hover:scale-105 focus:scale-105 bg-green-500`}
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
                                    className={`w-full justify-between h-14 text-lg text-white font-bold shadow-md transform transition-transform hover:scale-105 focus-scale-105 bg-teal-500`}
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
             <StudentHeader showBackButton={currentStep !== 'start'} onBack={handleGoBack} />
            <main className="flex-grow overflow-y-auto p-6 flex items-center">
                {renderContent()}
            </main>
        </div>
    );
}
