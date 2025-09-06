
"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mwalimuAiTutor } from '@/ai/flows/mwalimu-ai-flow';
import type { MwalimuAiTutorInput } from '@/ai/flows/mwalimu-ai-types';
import { Loader2, Send } from 'lucide-react';
import Link from 'next/link';

type Message = {
    role: 'user' | 'model';
    content: string;
};

export default function ChatInterface({ subject }: { subject: string }) {
    const searchParams = useSearchParams();
    const grade = searchParams.get('grade') || 'g7'; // Default for safety
    const gradeName = `Grade ${grade.replace('g', '')}`
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial message from Mwalimu AI
        const getInitialMessage = async () => {
            try {
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
        setInput('');
        setLoading(true);

        try {
            const result = await mwalimuAiTutor({
                grade,
                subject,
                history: newMessages.map(m => ({ role: m.role, content: m.content })),
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
        <div className="flex h-screen w-full items-center justify-center bg-muted/40">
            <Card className="w-full max-w-2xl h-[90vh] flex flex-col">
                <CardHeader className='border-b'>
                    <CardTitle className="font-headline text-2xl flex justify-between items-center">
                        <span>Mwalimu AI: {subject} ({gradeName})</span>
                        <Button variant="ghost" asChild>
                            <Link href={`/student/journey/subject?grade=${grade}`}>End Chat</Link>
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full" ref={scrollAreaRef}>
                        <div className="p-6 space-y-4">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            ))}
                             {loading && messages.length > 0 && (
                                <div className="flex justify-start">
                                    <div className="max-w-[75%] p-3 rounded-lg bg-muted flex items-center">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 border-t">
                    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                        <Input
                            id="message"
                            placeholder="Ask a question..."
                            className="flex-1"
                            autoComplete="off"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
