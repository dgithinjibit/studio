"use client"

import { useState } from "react";
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePen, ClipboardList, CalendarDays, CopySlash, GraduationCap, Mail, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

const GenerateLessonPlanDialog = dynamic(() => import('@/components/generate-lesson-plan-dialog'), { ssr: false });
const GenerateSchemeOfWorkDialog = dynamic(() => import('@/components/generate-scheme-of-work-dialog'), { ssr: false });
const GenerateRubricDialog = dynamic(() => import('@/components/generate-rubric-dialog'), { ssr: false });
const GenerateWorksheetDialog = dynamic(() => import('@/components/generate-worksheet-dialog'), { ssr: false });
const DifferentiateWorksheetDialog = dynamic(() => import('@/components/differentiate-worksheet-dialog'), { ssr: false });
const GenerateFamilyEmailDialog = dynamic(() => import('@/components/generate-family-email-dialog'), { ssr: false });


const teacherTools = [
    {
        title: "Schemer: Schemes of Work",
        description: "Create complete Schemes of Work from curriculum data.",
        icon: CalendarDays,
        action: "Open Schemer",
        dialog: "schemeOfWork",
        path: "@/components/generate-scheme-of-work-dialog"
    },
    {
        title: "Lesson Plan Generator",
        description: "Create CBC-aligned lesson plans",
        icon: FilePen,
        action: "Open Lesson Plan Generator",
        dialog: "lessonPlan",
        path: "@/components/generate-lesson-plan-dialog"
    },
    {
        title: "Worksheet Generator",
        description: "Generate printable worksheets",
        icon: ClipboardList,
        action: "Open Worksheet Generator",
        dialog: "worksheet",
        path: "@/components/generate-worksheet-dialog"
    },
    {
        title: "Differentiation Station",
        description: "Adapt worksheets for all learners",
        icon: CopySlash,
        action: "Open Differentiation Station",
        dialog: "differentiate",
        path: "@/components/differentiate-worksheet-dialog"
    },
    {
        title: "Rubric Generator",
        description: "Create custom rubrics",
        icon: GraduationCap,
        action: "Open Rubric Generator",
        dialog: "rubric",
        path: "@/components/generate-rubric-dialog"
    },
    {
        title: "Email to Family",
        description: "Generate professional parent communications",
        icon: Mail,
        action: "Open Email to Family",
        dialog: "familyEmail",
        path: "@/components/generate-family-email-dialog"
    }
];

export default function TeacherToolsPage() {
    const [dialogState, setDialogState] = useState({
        lessonPlan: false,
        schemeOfWork: false,
        rubric: false,
        worksheet: false,
        differentiate: false,
        familyEmail: false
    });
    const router = useRouter();

    const openDialog = (dialog: keyof typeof dialogState) => {
        setDialogState(prev => ({ ...prev, [dialog]: true }));
    };

    const closeDialog = (dialog: keyof typeof dialogState) => {
        setDialogState(prev => ({ ...prev, [dialog]: false }));
    };

    const handleToolClick = (dialog: string | null) => {
        if (dialog) {
            openDialog(dialog as keyof typeof dialogState);
        }
    };
    
    const onMouseEnter = (path: string | null) => {
        if (path) {
            router.prefetch(path);
        }
    }

    const onResourceSaved = () => {
        // We need to dispatch a custom event to tell the MyResources component to update
        // because localStorage changes in the same window don't trigger the 'storage' event.
        window.dispatchEvent(new CustomEvent('resource-update'));
        router.push('/dashboard/reports');
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
                                    <Button 
                                        variant="secondary" 
                                        className="w-full" 
                                        onClick={() => handleToolClick(tool.dialog)}
                                        onMouseEnter={() => onMouseEnter(tool.path)}
                                    >
                                        {tool.action}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </CardContent>
            </Card>

             {dialogState.lessonPlan && <GenerateLessonPlanDialog 
                open={dialogState.lessonPlan} 
                onOpenChange={(open) => !open && closeDialog('lessonPlan')} 
                onResourceSaved={onResourceSaved}
             />}
             {dialogState.schemeOfWork && <GenerateSchemeOfWorkDialog 
                open={dialogState.schemeOfWork} 
                onOpenChange={(open) => !open && closeDialog('schemeOfWork')}
                onResourceSaved={onResourceSaved}
             />}
             {dialogState.rubric && <GenerateRubricDialog 
                open={dialogState.rubric} 
                onOpenChange={(open) => !open && closeDialog('rubric')} 
                onResourceSaved={onResourceSaved} 
             />}
             {dialogState.worksheet && <GenerateWorksheetDialog 
                open={dialogState.worksheet} 
                onOpenChange={(open) => !open && closeDialog('worksheet')} 
                onResourceSaved={onResourceSaved} 
             />}
             {dialogState.differentiate && <DifferentiateWorksheetDialog 
                open={dialogState.differentiate} 
                onOpenChange={(open) => !open && closeDialog('differentiate')} 
                onResourceSaved={onResourceSaved} 
            />}
            {dialogState.familyEmail && <GenerateFamilyEmailDialog
                open={dialogState.familyEmail}
                onOpenChange={(open) => !open && closeDialog('familyEmail')}
            />}
        </>
    );
}
