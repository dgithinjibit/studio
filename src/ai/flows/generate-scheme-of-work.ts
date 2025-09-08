
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
  strand: z.string().describe('The main curriculum strand. This should be the main title.'),
  subStrand: z.string().describe('The sub-strand or specific topic area.'),
  lessonsPerWeek: z.string().describe('The number of lessons to be taught each week.'),
  schemeOfWorkContext: z.string().optional().describe('A string containing the Learning Outcomes, Suggested Activities, and Key Inquiry Questions for the sub-strand.')
});
export type GenerateSchemeOfWorkInput = z.infer<typeof GenerateSchemeOfWorkInputSchema>;

const GenerateSchemeOfWorkOutputSchema = z.object({
  schemeOfWork: z.string().describe('The generated scheme of work in a structured Markdown format, including a main title, a table, and sections for competencies and values.'),
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

Generate a detailed Scheme of Work based on the following information. The entire output must be in Markdown.

**Subject:** {{{subject}}}
**Grade:** {{{grade}}}
**Main Strand Title:** {{{strand}}}
**Sub-Strand for this Scheme:** {{{subStrand}}}
**Lessons:** {{{lessonsPerWeek}}}

{{#if schemeOfWorkContext}}
---
**CONTEXT FROM CURRICULUM DOCUMENT (Your Primary Source of Truth):**
You MUST use the following curriculum details to generate the content. Do not add information not present in this context.
{{{schemeOfWorkContext}}}
---
{{/if}}

**CRITICAL FORMATTING INSTRUCTIONS:**
The final output must follow this exact Markdown structure:

**STRAND: {{{strand}}}**

| Strand | Sub Strand | Specific Learning Outcomes | Suggested Learning Experiences | Key Inquiry Question(S) |
| :--- | :--- | :--- | :--- | :--- |
| {{{strand}}} | **{{{subStrand}}}** <br> ({{{lessonsPerWeek}}} lessons) | By the end of the sub-strand, the learner should be able to: <br> [Extract and list the learning outcomes from the context here as a lettered list, e.g., a) b) c)...] | Learner is guided to: <br> [Extract and list the learning experiences from the context here as a bulleted list] | [Extract the key inquiry question(s) from the context here] |

---

**Core Competencies to be developed:**
- [Based on the context, identify and list 1-2 relevant core competencies and briefly explain how they apply. Example: Digital Literacy: Learners interact with new technology...]

**Values:**
- [Based on the context, identify and list 1-2 relevant values and briefly explain how they apply. Example: Unity: Learners cooperate as they practice...]

Create a comprehensive and practical scheme of work based on these inputs and format.
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
