
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { blockchainCurriculum } from "@/lib/blockchain-curriculum";
import { ArrowLeft } from "lucide-react";

interface BlockchainCurriculumDisplayProps {
    onBack: () => void;
}

export function BlockchainCurriculumDisplay({ onBack }: BlockchainCurriculumDisplayProps) {
    return (
        <Card className="w-full h-full flex flex-col shadow-2xl bg-white/50 border-stone-200">
            <CardHeader className="border-b border-stone-200 relative">
                 <Button variant="ghost" size="icon" onClick={onBack} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 hover:bg-stone-100">
                    <ArrowLeft />
                    <span className="sr-only">Back</span>
                </Button>
                <div className="text-center">
                    <CardTitle className="font-headline text-3xl text-stone-800">AI & Blockchain Curriculum</CardTitle>
                    <CardDescription className="text-stone-600">A Comprehensive Framework for Integrating Blockchain Technology into Kenya's Education System</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full">
                    <div className="prose prose-stone max-w-none p-6 md:p-8" dangerouslySetInnerHTML={{ __html: blockchainCurriculum }}>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
