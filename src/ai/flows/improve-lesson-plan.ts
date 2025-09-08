
'use server';

/**
 * @fileOverview AI agent to improve an existing lesson plan based on user feedback.
 *
 * - improveLessonPlan - A function that handles the lesson plan improvement process.
 */

import {ai} from '@/ai/genkit';
import {
  ImproveLessonPlanInput,
  ImproveLessonPlanInputSchema,
  ImproveLessonPlanOutput,
  ImproveLessonPlanOutputSchema,
} from './improve-lesson-plan-types';
import { z } from 'zod';


export async function improveLessonPlan(
  input: ImproveLessonPlanInput,
  onUpdate: (chunk: string) => void
): Promise<void> {
  const stream = await improveLessonPlanFlow(input);
  for await (const chunk of stream) {
    onUpdate(chunk);
  }
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
    outputSchema: z.string(),
  },
  async (input) => {
    const { stream } = await ai.generate({
      prompt: prompt.prompt,
      model: ai.getModel(),
      input: input,
      stream: true,
      output: {
        format: 'text',
      }
    });

    let finalResult = "";
    for await (const chunk of stream) {
      finalResult += chunk.output?.text;
    }

    const {output} = await prompt(input);
    return output!.revisedLessonPlan;
  }
);
