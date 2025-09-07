
"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePen, ClipboardList, CalendarDays, CopySlash, GraduationCap, Mail } from "lucide-react";
import { GenerateLessonPlanDialog } from '@/components/generate-lesson-plan-dialog';
import { GenerateSchemeOfWorkDialog } from '@/components/generate-scheme-of-work-dialog';
import { GenerateRubricDialog } from '@/components/generate-rubric-dialog';
import { GenerateWorksheetDialog } from '@/components/generate-worksheet-dialog';
import { DifferentiateWorksheetDialog } from '@/components/differentiate-worksheet-dialog';
import { useRouter } from 'next/navigation';

const teacherTools = [
    {
        title: "Schemer: Schemes of Work",
        description: "Create complete Schemes of Work from curriculum data.",
        icon: CalendarDays,
        action: "Open Schemer",
        dialog: "schemeOfWork"
    },
    {
        title: "Lesson Plan Generator",
        description: "Create CBC-aligned lesson plans",
        icon: FilePen,
        action: "Open Lesson Plan Generator",
        dialog: "lessonPlan"
    },
    {
        title: "Worksheet Generator",
        description: "Generate printable worksheets",
        icon: ClipboardList,
        action: "Open Worksheet Generator",
        dialog: "worksheet"
    },
    {
        title: "Differentiation Station",
        description: "Adapt worksheets for all learners",
        icon: CopySlash,
        action: "Open Differentiation Station",
        dialog: "differentiate"
    },
    {
        title: "Rubric Generator",
        description: "Create custom rubrics",
        icon: GraduationCap,
        action: "Open Rubric Generator",
        dialog: "rubric"
    },
    {
        title: "Email to Family",
        description: "Generate professional parent communications",
        icon: Mail,
        action: "Open Email to Family",
        dialog: null
    }
];

export default function TeacherToolsPage() {
    const [isLessonPlanDialogOpen, setLessonPlanDialogOpen] = useState(false);
    const [isSchemeOfWorkDialogOpen, setSchemeOfWorkDialogOpen] = useState(false);
    const [isRubricDialogOpen, setRubricDialogOpen] = useState(false);
    const [isWorksheetDialogOpen, setWorksheetDialogOpen] = useState(false);
    const [isDifferentiateDialogOpen, setDifferentiateDialogOpen] = useState(false);
    const router = useRouter();

    const handleToolClick = (dialog: string | null) => {
        if (dialog === 'lessonPlan') setLessonPlanDialogOpen(true);
        else if (dialog === 'schemeOfWork') setSchemeOfWorkDialogOpen(true);
        else if (dialog === 'rubric') setRubricDialogOpen(true);
        else if (dialog === 'worksheet') setWorksheetDialogOpen(true);
        else if (dialog === 'differentiate') setDifferentiateDialogOpen(true);
    };

    const onResourceSaved = () => {
        // We need to dispatch a custom event to tell the MyResources component to update
        // because localStorage changes in the same window don't trigger the 'storage' event.
        window.dispatchEvent(new CustomEvent('resource-update'));
        router.push('/dashboard/resources');
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="font-mono text-2xl text-primary">🛠️ Teacher Tools</CardTitle>
                    <CardDescription>Powerful AI-driven tools to assist in your teaching workflow.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teacherTools.map((tool, index) => {
                        const Icon = tool.icon;
                        return (
                             <Card key={index} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <Icon className="w-6 h-6 text-accent" />
                                        {tool.title}
                                    </CardTitle>
                                    <CardDescription>{tool.description}</CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto">
                                    <Button variant="secondary" className="w-full" onClick={() => handleToolClick(tool.dialog)}>
                                        {tool.action}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </CardContent>
            </Card>

             <GenerateLessonPlanDialog 
                open={isLessonPlanDialogOpen} 
                onOpenChange={setLessonPlanDialogOpen} 
                onResourceSaved={onResourceSaved}
             />
             <GenerateSchemeOfWorkDialog 
                open={isSchemeOfWorkDialogOpen} 
                onOpenChange={setSchemeOfWorkDialogOpen}
                onResourceSaved={onResourceSaved}
             />
             <GenerateRubricDialog open={isRubricDialogOpen} onOpenChange={setRubricDialogOpen} onResourceSaved={onResourceSaved} />
             <GenerateWorksheetDialog open={isWorksheetDialogOpen} onOpenChange={setWorksheetDialogOpen} onResourceSaved={onResourceSaved} />
             <DifferentiateWorksheetDialog open={isDifferentiateDialogOpen} onOpenChange={setDifferentiateDialogOpen} onResourceSaved={onResourceSaved} />
        </>
    );
}
