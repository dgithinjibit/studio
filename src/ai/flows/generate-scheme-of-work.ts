
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
  schemeOfWorkContext: z.string().optional().describe('A string containing the Learning Outcomes, Suggested Activities, and Key Inquiry Questions for the sub-strand.')
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

{{#if schemeOfWorkContext}}
---
**CONTEXT FROM CURRICULUM DOCUMENT:**
You MUST use the following curriculum details as the primary source of truth for creating the learning outcomes and activities.
{{{schemeOfWorkContext}}}
---
{{/if}}

**CRITICAL INSTRUCTIONS FOR LEARNING ACTIVITIES:**
When generating the "Learning Activities", you MUST structure them according to the three CBC domains of learning. Use the following framework as your guide. Be creative and specific.

1.  **Knowledge (Cognitive Domain):** Focus on intellectual skills. What will learners *know* or *understand*? Use verbs like: Remember (list, define, recite), Understand (describe, explain, summarize), Apply (apply, use, demonstrate), Analyze (classify, break down, compare), Evaluate (judge, argue, justify), Create (design, formulate, build).
    *(Example: "Learners brainstorm and list the language groups in Eastern Africa (Remembering). Learners discuss the reasons for migration (Understanding).")*

2.  **Skills (Psychomotor Domain):** Focus on physical skills and performing tasks. What will learners be able to *do*? Use verbs like: Basic Movement (perform, run, draw), Perceptual Abilities (use a map, judge distance), Skilled Movements (perform a strategic game, create a dance), Communication (role-play, perform a skit, present).
    *(Example: "Learners draw the movement routes on a map (Perceptual). Learners perform a cultural dance from one of the groups (Skilled).")*

3.  **Attitude (Affective Domain):** Focus on values, interests, and appreciation. What values or feelings will be developed? Use verbs like: Receiving (listen respectfully), Responding (participate, answer questions), Valuing (express opinions, show appreciation), Organization (work in groups, compare perspectives), Characterization (demonstrate teamwork, integrity).
    *(Example: "Learners work in groups to appreciate the unity and diversity of language groups (Organization). Learners respectfully listen to other groups' presentations (Receiving).")*

The scheme of work must be a Markdown table with the following columns:
- **Week**: The week number.
- **Lesson**: The lesson number within the week.
- **Topic/Sub-Topic**: The specific topic for the lesson, derived from the Sub-Strand.
- **Learning Outcomes**: Must begin with the exact phrase "By the end of the lesson, the learner should be able to:" followed by a lettered list (e.g., a. b. c.) of specific outcomes. These outcomes must be directly derived from the \`schemeOfWorkContext\` if provided.
- **Learning Activities**: Specific learning experiences structured around the CBC pillars (Knowledge, skill, attitude). These activities must be directly derived from the \`schemeOfWorkContext\` if provided.
- **Key Inquiry Question(s)**: Socratic questions to provoke critical thinking. These questions must be directly derived from the \`schemeOfWorkContext\` if provided.
- **Resources**: Learning resources required for the lesson.
- **Assessment**: The method of assessment to be used (e.g., Oral questions, Observation, Project).

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
