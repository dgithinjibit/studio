
"use client";

import { useEffect, useState } from 'react';
import ChatInterface from '../chat-interface';
import { useRouter, useSearchParams, useParams } from 'next/navigation';

export default function StudentChatPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    
    // We need to manage state for all the possible parameters.
    // This allows the ChatInterface to be rendered dynamically based on what's available.
    const [chatParams, setChatParams] = useState<{
        subject: string;
        grade: string;
        studentFirstName: string;
        teacherContext?: string;
    } | null>(null);

    useEffect(() => {
        // This effect runs on the client side to retrieve all necessary data from localStorage.
        const subject = (params.subject as string) || 'General';
        const grade = localStorage.getItem('studentGrade') || 'g4';
        const studentFirstName = (localStorage.getItem('studentName') || 'Student').split(' ')[0];
        
        // This is the special context loaded when a user enters a teacher's code.
        const teacherContext = localStorage.getItem('ai_tutor_context_to_load') || undefined;

        setChatParams({
            subject,
            grade,
            studentFirstName,
            teacherContext
        });

        // Clean up the temporary context key so it's not used again accidentally.
        if (teacherContext) {
            localStorage.removeItem('ai_tutor_context_to_load');
        }

    }, [params.subject, searchParams]);

    const handleBack = () => {
        router.push('/student/journey');
    };

    if (!chatParams) {
        // You can render a loading spinner here while waiting for client-side useEffect
        return <div className="flex h-screen w-screen items-center justify-center bg-[#F5F5DC]"><p>Loading Chat...</p></div>;
    }

    return (
        <div className="flex flex-col w-full h-screen sm:h-[95vh] max-w-4xl mx-auto overflow-hidden">
            <ChatInterface 
                subject={chatParams.subject}
                grade={chatParams.grade}
                studentFirstName={chatParams.studentFirstName}
                onBack={handleBack}
                teacherContext={chatParams.teacherContext}
            />
        </div>
    );
}
