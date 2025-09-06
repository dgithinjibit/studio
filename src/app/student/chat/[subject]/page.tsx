
"use client";

import { Suspense } from 'react';
import ChatInterface from './chat-interface';

export default function ChatPage({ params }: { params: { subject: string } }) {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Chat...</div>}>
            <ChatInterface subject={decodeURIComponent(params.subject)} />
        </Suspense>
    );
}
