
"use client";

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit, KeyRound, Link as LinkIcon, Loader2, Award, BookOpen } from 'lucide-react';
import { StudentHeader } from '@/components/layout/student-header';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { TeacherResource } from '@/lib/types';
import { levels, subLevelsMap, gradesMap, subjectsMap, Step, recommendedSubjects } from '@/lib/journey-data';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, storage } from '@/lib/firebase';
import { ref, getBytes } from 'firebase/storage';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';


const ChatInterface = dynamic(() => import('../chat/chat-interface'), {
    ssr: false,
    loading: () => <ChatSkeleton />
});

const ChatSkeleton = () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
         <div className="w-full h-full flex flex-col shadow-2xl bg-card/50 border-border">
            <Skeleton className="h-32 w-full border-b border-border" />
            <div className="flex-1 p-6 space-y-4">
                <Skeleton className="h-16 w-3/4" />
                <div className="flex justify-end">
                    <Skeleton className="h-12 w-1/2" />
                </div>
                <Skeleton className="h-24 w-4/5" />
            </div>
            <Skeleton className="h-20 w-full border-t border-border" />
        </div>
    </div>
);


function StudentJourneyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedSubLevel, setSelectedSubLevel] = useState<string | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [studentFirstName, setStudentFirstName] = useState('Student');
    const [teacherCode, setTeacherCode] = useState('');
    const [isSubmittingCode, setIsSubmittingCode] = useState(false);

    // State for launching the AI tutor
    const [tutorContext, setTutorContext] = useState<string | null>(null);
    const [tutorRoomId, setTutorRoomId] = useState<string | null>(null);
    
    const initialStepFromParams = (searchParams.get('step') as Step) || 'start';

    const [stepHistory, setStepHistory] = useState<Step[]>(['start']);
    const currentStep = stepHistory[stepHistory.length - 1];

    useEffect(() => {
        const name = localStorage.getItem('studentName');
        if (name) {
            setStudentFirstName(name.split(' ')[0]);
        }
        
        const grade = localStorage.getItem('studentGrade');
        if (initialStepFromParams === 'subject' && grade) {
            const subLevel = Object.keys(gradesMap).find(key => gradesMap[key].some(g => g.id === grade));
            const level = subLevel ? Object.keys(subLevelsMap).find(key => subLevelsMap[key].some(sl => sl.id === subLevel)) : null;

            if (level && subLevel) {
                 setSelectedLevel(level);
                 setSelectedSubLevel(subLevel);
                 setSelectedGrade(grade);
                 setStepHistory(['start', 'level', 'sub-level', 'grade', 'subject']);
            }
        } else {
             setStepHistory([initialStepFromParams]);
        }
    }, [initialStepFromParams]);
    
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
    
     const handleCompassBack = () => {
        // This function specifically handles returning from the Compass chat view
        setTutorContext(null);
        setTutorRoomId(null);
        // We can go back to the start, or wherever is appropriate
        setStepHistory(['start']);
    };


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
            const q = query(collection(db, "teacherResources"), where("joinCode", "==", teacherCode.trim().toUpperCase()));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const tutorContextResource = doc.data() as TeacherResource;

                // Download the context content from the URL specified in Firestore
                const response = await fetch(tutorContextResource.url);
                if (!response.ok) {
                    throw new Error('Failed to fetch context file from storage.');
                }
                const contextText = await response.text();
                
                toast({
                    title: "Teacher's Room Found!",
                    description: "Launching the Classroom Compass. Your AI guide is ready.",
                });

                // Set state to render the chat interface directly
                setTutorContext(contextText);
                setTutorRoomId(tutorContextResource.joinCode);
                
            } else {
                toast({
                    variant: 'destructive',
                    title: "Invalid Code",
                    description: "The code you entered does not match any AI Tutor room. Please check the code and try again.",
                });
            }
        } catch (error) {
             toast({
                variant: 'destructive',
                title: "Error Loading Room",
                description: "Could not load the teacher's materials. Please try again.",
            });
            console.error("Error handling teacher code:", error);
        } finally {
            setIsSubmittingCode(false);
        }
    }
    
    // If tutorContext is set, render the ChatInterface instead of the journey steps.
    if (tutorContext) {
        return (
             <div className="flex flex-col w-full h-screen sm:h-[90vh] max-w-5xl mx-auto overflow-hidden bg-card sm:rounded-2xl shadow-2xl ring-1 ring-black/10">
                <Suspense fallback={<ChatSkeleton />}>
                    <ChatInterface 
                        subject="Teacher's Context" // Subject can be generic
                        grade={localStorage.getItem('studentGrade') || 'g4'} // Use stored grade
                        roomId={tutorRoomId!}
                        onBack={handleCompassBack}
                        teacherContext={tutorContext}
                    />
                </Suspense>
             </div>
        )
    }

    const renderContent = () => {
        switch (currentStep) {
            case 'start':
                return (
                     <Card className="w-full bg-transparent border-none shadow-none">
                        <CardHeader>
                            <CardTitle>Choose Your Path</CardTitle>
                            <CardDescription>How would you like to start your learning session today?</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                           <Card className="p-6 flex flex-col items-center justify-center text-center">
                                <LinkIcon className="w-12 h-12 text-primary mb-4" />
                                <h3 className="font-bold text-xl mb-2">Join a Teacher's Room</h3>
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
                            <Card className="p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigateTo('level')}>
                                <BrainCircuit className="w-12 h-12 text-accent mb-4" />
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
                 const coreSubjects = selectedGrade ? (subjectsMap[selectedGrade] || []) : [];
                 const allSubjects = [...recommendedSubjects, ...coreSubjects];
                 const gradeName = selectedGrade ? `Grade ${selectedGrade.replace('g', '')}` : '';
                return (
                    <Card className="w-full bg-transparent border-none shadow-none">
                         <CardHeader>
                            <CardTitle>Choose Your Subject</CardTitle>
                            <CardDescription>What would you like to learn about today in {gradeName}?</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {allSubjects.map((subject) => (
                                    <Link key={subject.name} href={`/student/chat/${encodeURIComponent(subject.name)}`} passHref>
                                        <Card className={cn(
                                            "group relative overflow-hidden rounded-lg cursor-pointer transition-all hover:shadow-lg",
                                            recommendedSubjects.some(rs => rs.name === subject.name) ? "h-48 md:h-56" : "h-40"
                                        )}>
                                            <Image 
                                                src={subject.icon} 
                                                alt={`${subject.name} icon`} 
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                                <div className={cn(
                                                    "absolute inset-0 flex items-end p-4",
                                                    recommendedSubjects.some(rs => rs.name === subject.name) ? "bg-black/60 justify-center items-center" : "bg-black/50"
                                                )}>
                                                <h3 className={cn(
                                                    "font-bold text-white",
                                                    recommendedSubjects.some(rs => rs.name === subject.name) ? "text-2xl text-center" : "text-lg"
                                                )}>{subject.name}</h3>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                );
            case 'grade':
                const grades = selectedSubLevel ? gradesMap[selectedSubLevel] : [];
                return (
                    <Card className="w-full bg-transparent border-none shadow-none">
                        <CardHeader>
                            <CardTitle>Pick Your Grade</CardTitle>
                            <CardDescription>Almost there! Which grade are you in?</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {grades.map((grade, index) => (
                                <Button 
                                    key={grade.id} 
                                    className={`h-20 text-lg font-bold text-shadow-sm shadow-lg transform transition-transform hover:scale-105 focus:scale-105 bg-blue-500 hover:bg-blue-600 text-white`}
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
                             <CardTitle>Narrow It Down</CardTitle>
                             <CardDescription>Let's get more specific.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {subLevels.map((sub, index) => (
                                <Button 
                                    key={sub.id} 
                                    className={`w-full justify-between h-14 text-lg font-bold shadow-md transform transition-transform hover:scale-105 focus-scale-105 bg-green-500 hover:bg-green-600 text-white`}
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
                            <CardTitle>Choose Your Education Level</CardTitle>
                            <CardDescription>Where are you in your learning journey?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {levels.map((level, index) => (
                                <Button 
                                    key={level.id} 
                                    className={`w-full justify-between h-14 text-lg font-bold shadow-md transform transition-transform hover:scale-105 focus-scale-105 bg-teal-500 hover:bg-teal-600 text-white`}
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
        <div className="flex flex-col w-full h-screen sm:h-[90vh] max-w-5xl mx-auto overflow-hidden bg-card sm:rounded-2xl shadow-2xl ring-1 ring-border">
             <StudentHeader showBackButton={currentStep !== 'start'} onBack={handleGoBack} />
            <main className="flex-grow overflow-y-auto p-6 flex items-center">
                {renderContent()}
            </main>
        </div>
    );
}

export default function StudentJourneyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StudentJourneyContent />
        </Suspense>
    )
}

    



    
