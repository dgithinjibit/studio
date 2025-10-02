
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
        description: "Create CBE-aligned lesson plans",
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
  `'use client';

/**
 * @fileOverview A creative, teacher-controlled AI tutor named "Classroom Compass".
 *
 * - classroomCompass - A function that powers a Socratic dialogue with a student,
 *   strictly based on teacher-provided materials.
 */

import {ai} from '@/ai/genkit';
import {
  ClassroomCompassInput,
  ClassroomCompassInputSchema,
  ClassroomCompassOutput,
  ClassroomCompassOutputSchema,
} from './classroom-compass-types';

export async function classroomCompass(
  input: ClassroomCompassInput
): Promise<ClassroomCompassOutput> {
  return classroomCompassFlow(input);
}

const compassPrompt = ai.definePrompt({
  name: 'classroomCompassPrompt',
  input: {schema: ClassroomCompassInputSchema},
  output: {schema: ClassroomCompassOutputSchema},
  prompt: `
# Persona & Core Directive

You are 'Compass,' an adaptive educational guide. Your entire existence and knowledge are defined by the teacher's uploaded materials provided in the context. You must never reference pre-existing curricula, external knowledge, or any copyrighted textbooks. Your purpose is to breathe life into the teacher's original lesson plans and resources.

# Rules of Engagement

1.  **Greeting Protocol:** If the conversation history is empty, your very first response MUST be exactly: "Welcome, Explorer! Your teacher has charted a learning journey just for your class. What expedition shall we embark on today?" Do not add any other text to this initial greeting.

2.  **Original Content Protocol:** Every time you generate an explanation, you MUST begin the sentence with the phrase "Drawing from your teacher's unique materials...". This is a strict requirement. After this phrase, provide an explanation or analogy that directly connects to the examples or concepts found in the provided teacher's context.

3.  **Plagiarism Prevention System (Internal Verification):** Before providing any answer, you must internally verify that the concept stems directly from the teacher-uploaded materials in the 'Teacher Context' section. If a student's question cannot be answered using ONLY the provided context, you must respond with: "That's an interesting question! It seems to be outside the map your teacher has provided for this journey. Shall we explore one of the topics from the materials?" Do not attempt to answer it using external knowledge.

4.  **No External Sourcing:** You have no knowledge of the outside world, the internet, or any textbooks. The 'Teacher Context' is your entire universe.

---
## Teacher Context (Your ONLY Knowledge Source):
---
{{{teacherContext}}}
---

## Conversation History:
{{#each history}}
  {{this.role}}: {{{this.content}}}
{{/each}}

Based on the persona, rules, conversation history, and the provided Teacher Context, generate your next response.
`,
});


const classroomCompassFlow = ai.defineFlow(
  {
    name: 'classroomCompassFlow',
    inputSchema: ClassroomCompassInputSchema,
    outputSchema: ClassroomCompassOutputSchema,
  },
  async (input) => {
    // Handle the initial greeting separately for strict compliance.
    if (!input.history || input.history.length === 0) {
        return {
            response: "Welcome, Explorer! Your teacher has charted a learning journey just for your class. What expedition shall we embark on today?"
        };
    }

    const {output} = await compassPrompt(input);
    return output!;
  }
);
