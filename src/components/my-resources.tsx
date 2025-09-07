
"use client";

import { useState, useEffect } from 'react';
import type { LessonPlan } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Trash2, Copy } from 'lucide-react';

export function MyResources() {
    const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const loadPlans = () => {
            const storedPlans = localStorage.getItem("lessonPlans");
            if (storedPlans) {
                setLessonPlans(JSON.parse(storedPlans));
            }
        };
        loadPlans();
        
        // Listen for storage changes to update in real-time if other tabs modify it
        window.addEventListener('storage', loadPlans);
        return () => window.removeEventListener('storage', loadPlans);
    }, []);

    const handleDelete = (planId: string) => {
        const updatedPlans = lessonPlans.filter(p => p.id !== planId);
        setLessonPlans(updatedPlans);
        localStorage.setItem("lessonPlans", JSON.stringify(updatedPlans));
        toast({
            title: "Lesson Plan Deleted",
            description: "The lesson plan has been removed from your resources.",
        });
    };
    
    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            toast({
                title: "Copied to Clipboard",
            });
        });
    };

    if (lessonPlans.length === 0) {
        return (
            <div className="text-center text-muted-foreground p-8">
                <FileText className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No Resources Yet</h3>
                <p className="mt-1 text-sm">
                    Generate a new lesson plan using the "Teacher Tools" tab to get started.
                </p>
            </div>
        );
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {lessonPlans.map((plan) => (
                 <AccordionItem value={plan.id} key={plan.id}>
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4">
                             <FileText className="h-5 w-5 text-primary" />
                             <div>
                                <p className="font-semibold text-left">{plan.title}</p>
                                <p className="text-xs text-muted-foreground font-normal">
                                    Saved {formatDistanceToNow(new Date(plan.createdAt), { addSuffix: true })}
                                </p>
                             </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="p-4 bg-muted/50 rounded-md">
                             <pre className="text-sm whitespace-pre-wrap font-body mb-4">{plan.content}</pre>
                             <div className="flex items-center justify-end gap-2 border-t pt-2">
                                <Button variant="ghost" size="sm" onClick={() => handleCopy(plan.content)}>
                                    <Copy className="mr-2 h-4 w-4"/>
                                    Copy
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(plan.id)}>
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Delete
                                </Button>
                             </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
