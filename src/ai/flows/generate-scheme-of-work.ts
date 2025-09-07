
'use server';

/**
 * @fileOverview AI agent to generate a draft Scheme of Work.
 *
 * - generateSchemeOfWork - A function that handles the scheme of work generation process.
 * - GenerateSchemeOfWorkInput - The input type for the generateSchemeOfWork function.
 * - GenerateSchemeOfWorkOutput - The return type for the generateSchemeOfWork function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSchemeOfWorkInputSchema = z.object({
  subject: z.string().describe('The subject for the scheme of work.'),
  grade: z.string().describe('The grade level for the scheme of work.'),
  subStrand: z.string().describe('The sub-strand or specific topic area.'),
  numberOfWeeks: z.string().describe('The total number of weeks the scheme should cover.'),
  lessonsPerWeek: z.string().describe('The number of lessons to be taught each week.'),
  availableResources: z.string().describe('A list of available teaching and learning resources.'),
});
export type GenerateSchemeOfWorkInput = z.infer<typeof GenerateSchemeOfWorkInputSchema>;

const GenerateSchemeOfWorkOutputSchema = z.object({
  schemeOfWork: z.string().describe('The generated scheme of work in a structured table format (Markdown).'),
});
export type GenerateSchemeOfWorkOutput = z.infer<typeof GenerateSchemeOfWorkOutputSchema>;

export async function generateSchemeOfWork(
  input: GenerateSchemeOfWorkInput
): Promise<GenerateSchemeOfWorkOutput> {
  return generateSchemeOfWorkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSchemeOfWorkPrompt',
  input: {schema: GenerateSchemeOfWorkInputSchema},
  output: {schema: GenerateSchemeOfWorkOutputSchema},
  prompt: `You are an expert curriculum developer in Kenya, specializing in creating CBC-compliant Schemes of Work.

Generate a detailed Scheme of Work based on the following information. The output must be a Markdown table.

**Subject:** {{{subject}}}
**Grade:** {{{grade}}}
**Sub-Strand:** {{{subStrand}}}
**Duration:** {{{numberOfWeeks}}} weeks, with {{{lessonsPerWeek}}} lessons per week.
**Available Resources:** {{{availableResources}}}

The scheme of work should be structured in a table with the following columns:
- Week
- Lesson
- Topic/Sub-Topic
- Learning Outcomes
- Learning Activities
- Assessment Methods
- Resources

Create a comprehensive and practical scheme of work based on these inputs.
`,
});

const generateSchemeOfWorkFlow = ai.defineFlow(
  {
    name: 'generateSchemeOfWorkFlow',
    inputSchema: GenerateSchemeOfWorkInputSchema,
    outputSchema: GenerateSchemeOfWorkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
