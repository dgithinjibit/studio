
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mwalimuAiTutor } from '@/ai/flows/mwalimu-ai-flow';
import { Loader2, Send } from 'lucide-react';
import { StudentHeader } from '@/components/layout/student-header';

type Message = {
    role: 'user' | 'model';
    content: string;
};

export default function ChatInterface({ subject, grade, onBack }: { subject: string, grade: string, onBack?: () => void }) {
    const gradeName = `Grade ${grade.replace('g', '')}`
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [studentFirstName, setStudentFirstName] = useState('Student');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const name = localStorage.getItem('studentName');
        if (name) {
            setStudentFirstName(name.split(' ')[0]);
        }

        // Initial message from Mwalimu AI
        const getInitialMessage = async () => {
            setLoading(true);
            try {
                // The history is empty, so the flow will return a hardcoded greeting
                const result = await mwalimuAiTutor({ grade, subject, history: [] });
                setMessages([{ role: 'model', content: result.response }]);
            } catch (error) {
                console.error("Error getting initial message:", error);
                setMessages([{ role: 'model', content: "Hello! I'm having a little trouble connecting. Please try again in a moment." }]);
            } finally {
                setLoading(false);
            }
        };
        getInitialMessage();
    }, [grade, subject]);
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            // Pass the existing messages in history, and the new message separately
            const result = await mwalimuAiTutor({
                grade,
                subject,
                history: messages,
                currentMessage: currentInput,
            });
            setMessages([...newMessages, { role: 'model', content: result.response }]);
        } catch (error) {
            console.error("Error calling AI tutor:", error);
            setMessages([...newMessages, { role: 'model', content: "I'm sorry, I encountered an error. Could you please rephrase your question?" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center bg-[#F5F5DC]">
            <Card className="w-full h-full flex flex-col shadow-2xl bg-white/50 border-stone-200">
                <CardHeader className='border-b border-stone-200'>
                     <StudentHeader 
                        showBackButton={!!onBack} 
                        onBack={onBack!} 
                        studentFirstName={studentFirstName} 
                     />
                     <div className="text-center pt-2">
                        <CardTitle className="font-headline text-2xl text-stone-800">
                            Mwalimu AI: {subject} ({gradeName})
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full" ref={scrollAreaRef}>
                        <div className="p-6 space-y-4">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-3 rounded-lg ${message.role === 'user' ? 'bg-orange-500 text-white' : 'bg-green-100 text-green-900'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            ))}
                             {loading && messages.length === 0 && (
                                <div className="flex justify-start">
                                    <div className="max-w-[75%] p-3 rounded-lg bg-green-100/80 flex items-center text-green-900/80">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span className="ml-2 text-sm">Mwalimu AI is thinking...</span>
                                    </div>
                                </div>
                            )}
                             {loading && messages.length > 0 && (
                                <div className="flex justify-start">
                                    <div className="max-w-[75%] p-3 rounded-lg bg-green-100/80 flex items-center">
                                        <Loader2 className="h-5 w-5 animate-spin text-green-900/80" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 border-t border-stone-200">
                    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                        <Input
                            id="message"
                            placeholder="Ask a question..."
                            className="flex-1 bg-white border-stone-300 focus:border-orange-500 focus:ring-orange-500"
                            autoComplete="off"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" size="icon" disabled={loading || !input.trim()} className="bg-orange-500 hover:bg-orange-600 text-white">
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
