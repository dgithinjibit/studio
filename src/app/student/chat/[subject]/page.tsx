
"use client";

import { Suspense } from 'react';
import ChatInterface from '../chat-interface';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ChatPage({ params }: { params: { subject: string } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const grade = searchParams.get('grade') || 'g7'; // Default for safety

    // This page is not used in the new single-page flow,
    // but we'll keep it for direct access if needed.
    // The `onBack` prop will navigate the user to the journey page.
    const handleBack = () => {
        router.push('/student/journey');
    };

    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Chat...</div>}>
            <ChatInterface 
                subject={decodeURIComponent(params.subject)} 
                grade={grade}
                onBack={handleBack}
            />
        </Suspense>
    );
}
