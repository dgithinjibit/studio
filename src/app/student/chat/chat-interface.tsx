

"use client";

import { useState, useEffect, useRef, Fragment } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mwalimuAiTutor } from '@/ai/flows/mwalimu-ai-flow';
import { classroomCompass } from '@/ai/flows/classroom-compass-flow';
import { Loader2, Send, Video, Mic } from 'lucide-react';
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
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any | null>(null);
    const [choices, setChoices] = useState<string[]>([]);

     useEffect(() => {
        const name = localStorage.getItem('studentName');
        if (name) {
            setStudentFirstName(name.split(' ')[0]);
        }
    }, []);

    const parseResponse = (text: string) => {
        const choiceRegex = /\[CHOICE: (.*?)\]/g;
        const newChoices = [];
        let match;
        while ((match = choiceRegex.exec(text)) !== null) {
            newChoices.push(match[1]);
        }

        const cleanText = text.replace(choiceRegex, '').trim();
        setChoices(newChoices);
        return cleanText;
    };

    const processAndSetMessage = (role: 'model', response: { response: string, audioResponse?: string }) => {
        const cleanText = parseResponse(response.response);
        setMessages(prev => [...prev, { role, content: cleanText, audio: response.audioResponse }]);
    }

    useEffect(() => {
        // Initialize SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                setInput(input + finalTranscript + interimTranscript);
            };

            recognitionRef.current.onerror = (event: any) => {
                 if (event.error !== 'no-speech' && event.error !== 'aborted') {
                    console.error("Speech recognition error", event.error);
                }
                setIsListening(false);
            };
            
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

        }
    }, [input]);

    const handleToggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };


    useEffect(() => {
        const getInitialMessage = async () => {
            setLoading(true);
            try {
                const initialHistory: Message[] = [];
                let result;
                if (teacherContext) {
                    setTutorMode('compass');
                    const compassResult = await classroomCompass({ teacherContext, history: [] });
                    result = { response: compassResult.response, audioResponse: undefined };
                } else {
                    setTutorMode('mwalimu');
                    result = await mwalimuAiTutor({ 
                        grade, 
                        subject, 
                        history: initialHistory,
                        currentMessage: `Hello! Please introduce yourself and greet me as a ${subject} tutor for ${gradeName}.`
                    });
                }
                processAndSetMessage('model', result);
            } catch (error) {
                console.error("Error getting initial message:", error);
                setMessages([{ role: 'model', content: "Hello! I'm having a little trouble connecting. Please try again in a moment." }]);
            } finally {
                setLoading(false);
            }
        };
        getInitialMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grade, subject, teacherContext, gradeName]);
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
        
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'model' && lastMessage.audio && audioRef.current) {
             // Only play if the src is different, preventing interruption of the same audio
            if (audioRef.current.src !== lastMessage.audio) {
                audioRef.current.src = lastMessage.audio;
                audioRef.current.play().catch(e => console.error("Audio autoplay failed:", e));
            }
        }

    }, [messages]);

    const handleJoinVideoCall = () => {
        if (roomId) {
            router.push(`/dashboard/learning-lab/${roomId}/meet`);
        }
    };
    
    const handleChoiceClick = (choice: string) => {
        handleSubmit(undefined, choice);
    }

    const handleSubmit = async (e?: React.FormEvent, choice?: string) => {
        e?.preventDefault();
        const currentMessage = choice || input;
        if (!currentMessage.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: currentMessage };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages); // Show user message immediately
        setInput('');
        setLoading(true);
        setChoices([]); // Clear choices after user makes one

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
                    currentMessage: currentMessage,
                    history: newMessages // Pass the full, updated history
                });
            }
            processAndSetMessage('model', result);
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
                             {messages.length === 0 && loading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[75%] p-3 rounded-lg bg-muted flex items-center">
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                    </div>
                                </div>
                            )}
                            {messages.map((message, index) => (
                                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-3 rounded-lg ${message.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && messages.length > 0 && (
                                <div className="flex justify-start">
                                    <div className="max-w-[75%] p-3 rounded-lg bg-muted flex items-center">
                                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                    </div>
                                </div>
                            )}
                             {choices.length > 0 && !loading && (
                                <div className="flex justify-start">
                                    <div className="flex flex-col items-start gap-2">
                                        {choices.map((choice, index) => (
                                            <Button 
                                                key={index}
                                                variant="outline"
                                                className="bg-background"
                                                onClick={() => handleChoiceClick(choice)}
                                            >
                                                {choice}
                                            </Button>
                                        ))}
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
                            disabled={loading || choices.length > 0}
                        />
                         <Button type="button" size="icon" variant={isListening ? 'destructive' : 'outline'} onClick={handleToggleListening} disabled={loading}>
                            <Mic className="h-4 w-4" />
                            <span className="sr-only">Toggle Microphone</span>
                        </Button>
                        <Button type="submit" size="icon" disabled={loading || !input.trim() || choices.length > 0} className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
