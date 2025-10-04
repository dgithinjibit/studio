
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mwalimuAiTutor } from '@/ai/flows/mwalimu-ai-flow';
import { classroomCompass } from '@/ai/flows/classroom-compass-flow';
import { Loader2, Send, Video } from 'lucide-react';
import { StudentHeader } from '@/components/layout/student-header';
import { useRouter } from 'next/navigation';

type Message = {
    role: 'user' | 'model';
    content: string;
    audio?: string;
};

interface ChatInterfaceProps {
    subject: string;
    grade: string;
    onBack: () => void;
    teacherContext?: string;
    roomId?: string;
}

export default function ChatInterface({ subject, grade, onBack, teacherContext, roomId }: ChatInterfaceProps) {
    const gradeName = `Grade ${grade.replace('g', '')}`
    const router = useRouter();
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [tutorMode, setTutorMode] = useState<'compass' | 'mwalimu'>('mwalimu');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [studentFirstName, setStudentFirstName] = useState('Student');
    const audioRef = useRef<HTMLAudioElement | null>(null);

     useEffect(() => {
        const name = localStorage.getItem('studentName');
        if (name) {
            setStudentFirstName(name.split(' ')[0]);
        }
    }, []);

    useEffect(() => {
        const getInitialMessage = async () => {
            setLoading(true);
            try {
                let result;
                if (teacherContext) {
                    setTutorMode('compass');
                    // Classroom Compass does not have TTS yet.
                    const compassResult = await classroomCompass({ teacherContext: teacherContext, history: [] });
                    result = {response: compassResult.response, audioResponse: undefined};
                } else {
                    setTutorMode('mwalimu');
                    result = await mwalimuAiTutor({ grade, subject, history: [] });
                }
                setMessages([{ role: 'model', content: result.response, audio: result.audioResponse }]);
            } catch (error) {
                console.error("Error getting initial message:", error);
                setMessages([{ role: 'model', content: "Hello! I'm having a little trouble connecting. Please try again in a moment." }]);
            } finally {
                setLoading(false);
            }
        };
        getInitialMessage();
    }, [grade, subject, teacherContext]);
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
        
        // Auto-play audio for the last message if it's from the model
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'model' && lastMessage.audio && audioRef.current) {
            audioRef.current.src = lastMessage.audio;
            audioRef.current.play().catch(e => console.error("Audio autoplay failed:", e));
        }

    }, [messages]);

    const handleJoinVideoCall = () => {
        if (roomId) {
            router.push(`/dashboard/learning-lab/${roomId}/meet`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages); // Show user message immediately
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            let result;
            if (tutorMode === 'compass' && teacherContext) {
                 const compassResult = await classroomCompass({
                    teacherContext,
                    history: newMessages, // Pass the full, updated history
                });
                result = {response: compassResult.response, audioResponse: undefined};
            } else {
                 result = await mwalimuAiTutor({
                    grade,
                    subject,
                    currentMessage: currentInput,
                    history: newMessages // Pass the full, updated history
                });
            }
            setMessages([...newMessages, { role: 'model', content: result.response, audio: result.audioResponse }]);
        } catch (error) {
            console.error("Error calling AI tutor:", error);
            setMessages([...newMessages, { role: 'model', content: "I'm sorry, I encountered an error. Could you please rephrase your question?" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center bg-transparent">
            <Card className="w-full h-full flex flex-col shadow-none bg-transparent border-none">
                <CardHeader className='border-b border-border'>
                     <StudentHeader 
                        showBackButton={!!onBack} 
                        onBack={onBack!} 
                        showVideoCallButton={tutorMode === 'compass'}
                        onJoinVideoCall={handleJoinVideoCall}
                     />
                     <div className="text-center pt-2">
                        <CardTitle className="font-headline text-2xl text-foreground">
                            {tutorMode === 'compass' ? 'Classroom Compass' : `Mwalimu AI: ${subject}`} ({gradeName})
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full" ref={scrollAreaRef}>
                        <div className="p-6 space-y-4">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-3 rounded-lg ${message.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            ))}
                             {loading && messages.length === 0 && (
                                <div className="flex justify-start">
                                    <div className="max-w-[75%] p-3 rounded-lg bg-muted flex items-center text-muted-foreground">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span className="ml-2 text-sm">AI Tutor is thinking...</span>
                                    </div>
                                </div>
                            )}
                             {loading && messages.length > 0 && (
                                <div className="flex justify-start">
                                    <div className="max-w-[75%] p-3 rounded-lg bg-muted flex items-center">
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 border-t border-border">
                    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                        <Input
                            id="message"
                            placeholder="Ask a question..."
                            className="flex-1 bg-background border-input focus:border-primary focus:ring-primary"
                            autoComplete="off"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" size="icon" disabled={loading || !input.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
            <audio ref={audioRef} className="hidden" />
        </div>
    );
}
