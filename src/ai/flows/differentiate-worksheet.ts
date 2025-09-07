
'use server';

/**
 * @fileOverview AI agent to differentiate a piece of text for various learning levels.
 *
 * - differentiateWorksheet - A function that handles the worksheet differentiation process.
 * - DifferentiateWorksheetInput - The input type for the differentiateWorksheet function.
 * - DifferentiateWorksheetOutput - The return type for the differentiateWorksheet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DifferentiateWorksheetInputSchema = z.object({
  originalContent: z.string().describe('The original text content of the worksheet or document.'),
  gradeLevel: z.string().describe('The grade level for which the original content was intended.'),
  subject: z.string().describe('The subject of the content.'),
  levels: z.array(z.string()).describe("The reading levels to generate (e.g., ['Simpler Language', 'Advanced Challenge'])."),
});
export type DifferentiateWorksheetInput = z.infer<typeof DifferentiateWorksheetInputSchema>;

const DifferentiatedContentSchema = z.object({
    level: z.string().describe("The differentiation level (e.g., 'Simpler Language')."),
    content: z.string().describe('The rewritten content for that level.'),
});

const DifferentiateWorksheetOutputSchema = z.object({
  differentiatedContent: z.array(DifferentiatedContentSchema).describe('An array of content versions, one for each requested level.'),
});
export type DifferentiateWorksheetOutput = z.infer<typeof DifferentiateWorksheetOutputSchema>;

export async function differentiateWorksheet(
  input: DifferentiateWorksheetInput
): Promise<DifferentiateWorksheetOutput> {
  return differentiateWorksheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'differentiateWorksheetPrompt',
  input: {schema: DifferentiateWorksheetInputSchema},
  output: {schema: DifferentiateWorksheetOutputSchema},
  prompt: `You are an expert instructional designer. Your task is to rewrite the provided text for different reading and comprehension levels.

**IMPORTANT RULE:** You must ONLY use the information and concepts present in the original content. Do not introduce any external facts, examples, or information. Your goal is to adapt the existing text, not to add new knowledge.

**Original Content (for {{gradeLevel}} {{subject}}):**
---
{{{originalContent}}}
---

Please generate versions for the following levels:
{{#each levels}}
- {{this}}
{{/each}}

For each level, rewrite the original content to match the target audience's needs. For "Simpler Language," use shorter sentences and more basic vocabulary. For "Advanced Challenge," use more complex sentence structures and vocabulary, and perhaps reframe parts as more analytical questions, but without adding new information.
`,
});

const differentiateWorksheetFlow = ai.defineFlow(
  {
    name: 'differentiateWorksheetFlow',
    inputSchema: DifferentiateWorksheetInputSchema,
    outputSchema: DifferentiateWorksheetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
