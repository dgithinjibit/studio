
'use server';

/**
 * @fileOverview AI agent to generate a custom rubric for an assignment.
 *
 * - generateRubric - A function that handles the rubric generation process.
 * - GenerateRubricInput - The input type for the generateRubric function.
 * - GenerateRubricOutput - The return type for the generateRubric function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRubricInputSchema = z.object({
  grade: z.string().describe("The grade level for the assignment (e.g., '5th Grade')."),
  levels: z.string().describe("The number of performance levels for the rubric (e.g., '3')."),
  learningObjective: z.string().describe("The learning objective or standard (e.g., 'SWBAT write an argumentative essay')."),
  assignmentDescription: z.string().describe("A brief description of the student assignment."),
  criteria: z.string().optional().describe("Specific categories or criteria to include in the rubric (e.g., 'Include supporting arguments')."),
  standards: z.string().optional().describe("Any specific educational standards to align with (e.g., 'CCSS', 'TEKS')."),
  webSearch: z.boolean().optional().describe("Whether to use web search to inform the rubric generation."),
});
export type GenerateRubricInput = z.infer<typeof GenerateRubricInputSchema>;

const GenerateRubricOutputSchema = z.object({
  rubric: z.string().describe('The generated rubric in a structured Markdown table format.'),
});
export type GenerateRubricOutput = z.infer<typeof GenerateRubricOutputSchema>;

export async function generateRubric(
  input: GenerateRubricInput
): Promise<GenerateRubricOutput> {
  return generateRubricFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRubricPrompt',
  input: {schema: GenerateRubricInputSchema},
  output: {schema: GenerateRubricOutputSchema},
  prompt: `You are an expert curriculum designer specializing in creating detailed, standards-aligned assessment rubrics.

Generate a comprehensive rubric based on the following assignment details. The rubric must be a Markdown table.

**Grade Level:** {{{grade}}}
**Assignment:** {{{assignmentDescription}}}
**Learning Objective:** {{{learningObjective}}}
**Number of Performance Levels:** {{{levels}}}

{{#if criteria}}
**Required Criteria:** {{{criteria}}}
{{/if}}

{{#if standards}}
**Align to Standards:** {{{standards}}}
{{/if}}

The rubric should have a column for the "Criteria" and then {{{levels}}} columns for the performance levels (e.g., "Beginning", "Developing", "Proficient"). For each criterion, provide a clear description of what is expected at each performance level.

{{#if webSearch}}
You may use your knowledge and web search capabilities to find relevant standards and best practices to make this a high-quality, effective rubric.
{{/if}}
`,
});

const generateRubricFlow = ai.defineFlow(
  {
    name: 'generateRubricFlow',
    inputSchema: GenerateRubricInputSchema,
    outputSchema: GenerateRubricOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
