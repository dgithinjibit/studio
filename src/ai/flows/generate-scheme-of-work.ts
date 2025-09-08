
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
  schemeOfWork: z.string().describe('The generated scheme of work in a structured Markdown format, broken down by week and lesson.'),
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
  prompt: `You are an expert curriculum developer in Kenya, creating a CBC-compliant Scheme of Work.

Generate a detailed Scheme of Work based on the following information. The entire output must be in Markdown.

**Subject:** {{{subject}}}
**Grade:** {{{grade}}}
**Sub-Strand for this Scheme:** {{{subStrand}}}
**Total Lessons for Sub-Strand:** {{{lessonsPerWeek}}}

{{#if schemeOfWorkContext}}
---
**CONTEXT FROM CURRICULUM DOCUMENT (Your Primary Source of Truth):**
You MUST use the following curriculum details to generate the content. Do not add information not present in this context.
{{{schemeOfWorkContext}}}
---
{{/if}}

**CRITICAL FORMATTING INSTRUCTIONS:**
The final output must follow this exact Markdown structure, broken down by week and lesson. Generate content for each week until all {{{lessonsPerWeek}}} lessons for the sub-strand are covered.

---
**WEEK 1**

**LESSON 1**
- **Strand:** {{{strand}}}
- **Sub Strand:** {{{subStrand}}}
- **Lesson Learning outcomes:** [Based on the context, list the specific learning outcome for this single lesson.]
- **Learning Experiences:** [Based on the context, describe the suggested learning experience for this single lesson.]
- **Key Inquiry Question(s):** [Based on the context, list the relevant key inquiry question for this lesson.]
- **Assessment:** [Suggest a relevant formative assessment method for this lesson, e.g., Observation, Checklist, Q&A.]
- **Reflection:** [Leave this section blank.]

**LESSON 2**
- **Strand:** {{{strand}}}
- **Sub Strand:** {{{subStrand}}}
- **Lesson Learning outcomes:** [List the learning outcome for this lesson.]
- **Learning Experiences:** [Describe the learning experience for this lesson.]
- **Key Inquiry Question(s):** [List the inquiry question for this lesson.]
- **Assessment:** [Suggest a relevant assessment method.]
- **Reflection:** [Leave this section blank.]

---
**WEEK 2**

...[Continue this format for all subsequent lessons and weeks]...
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
