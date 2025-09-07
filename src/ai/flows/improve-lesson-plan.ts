
'use server';

/**
 * @fileOverview AI agent to improve an existing lesson plan based on user feedback.
 *
 * - improveLessonPlan - A function that handles the lesson plan improvement process.
 * - ImproveLessonPlanInput - The input type for the improveLessonPlan function.
 * - ImproveLessonPlanOutput - The return type for the improveLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ImproveLessonPlanInputSchema = z.object({
  lessonPlan: z.string().describe('The current version of the lesson plan to be improved.'),
  request: z.string().describe("The user's request for how to improve the lesson plan (e.g., 'make it more interactive', 'add a section for special needs students')."),
});
export type ImproveLessonPlanInput = z.infer<typeof ImproveLessonPlanInputSchema>;

export const ImproveLessonPlanOutputSchema = z.object({
  revisedLessonPlan: z.string().describe('The newly revised lesson plan based on the user request.'),
});
export type ImproveLessonPlanOutput = z.infer<typeof ImproveLessonPlanOutputSchema>;

export async function improveLessonPlan(
  input: ImproveLessonPlanInput
): Promise<ImproveLessonPlanOutput> {
  return improveLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveLessonPlanPrompt',
  input: {schema: ImproveLessonPlanInputSchema},
  output: {schema: ImproveLessonPlanOutputSchema},
  prompt: `You are an expert instructional design assistant. Your task is to revise and improve the provided lesson plan based on the user's specific request.

**Original Lesson Plan:**
---
{{{lessonPlan}}}
---

**User's Improvement Request:**
---
"{{{request}}}"
---

Based on the request, generate a new, complete, and improved version of the lesson plan. Do not just add a section; integrate the feedback into a cohesive, updated document.
`,
});

const improveLessonPlanFlow = ai.defineFlow(
  {
    name: 'improveLessonPlanFlow',
    inputSchema: ImproveLessonPlanInputSchema,
    outputSchema: ImproveLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return { revisedLessonPlan: output!.revisedLessonPlan };
  }
);

