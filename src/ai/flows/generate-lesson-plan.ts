
'use server';

/**
 * @fileOverview AI agent to generate a draft lesson plan from a prompt, optionally using a Scheme of Work as context.
 *
 * - generateLessonPlan - A function that handles the lesson plan generation process.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  subject: z.string().describe('The subject of the lesson plan.'),
  topic: z.string().describe('The topic of the lesson plan.'),
  gradeLevel: z.string().describe('The grade level for the lesson plan.'),
  learningObjectives: z
    .string()
    .describe('The learning objectives for the lesson plan.'),
  schemeOfWorkContext: z
    .string()
    .optional()
    .describe('The full Markdown content of the relevant Scheme of Work for context.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const GenerateLessonPlanOutputSchema = z.object({
  lessonPlan: z.string().describe('The generated lesson plan.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(
  input: GenerateLessonPlanInput
): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLessonPlanPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an expert teacher and curriculum developer in Kenya. Your task is to generate a detailed, single-lesson plan based on the provided information.

**Core Details:**
- **Subject:** {{{subject}}}
- **Topic:** {{{topic}}}
- **Grade Level:** {{{gradeLevel}}}
- **Learning Objectives:** {{{learningObjectives}}}

{{#if schemeOfWorkContext}}
---
**CONTEXT: SCHEME OF WORK**
You MUST use the following Scheme of Work as the primary source of truth for creating the lesson plan. The lesson plan should be for one specific lesson outlined within this scheme.
{{{schemeOfWorkContext}}}
---
**Instruction:** Based on the scheme, select one lesson and create a detailed lesson plan for it. Include learning activities, resources, and assessment methods mentioned in the scheme.
{{else}}
**Instruction:** Generate a standard lesson plan based on the core details provided above.
{{/if}}

Output the complete lesson plan in Markdown format.
`,
});


const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
