
'use server';

/**
 * @fileOverview AI agent to generate a draft worksheet.
 *
 * - generateWorksheet - A function that handles the worksheet generation process.
 * - GenerateWorksheetInput - The input type for the generateWorksheet function.
 * - GenerateWorksheetOutput - The return type for the generateWorksheet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorksheetInputSchema = z.object({
  grade: z.string().describe("The grade level for the worksheet (e.g., 'Grade 5')."),
  subject: z.string().describe("The subject of the worksheet (e.g., 'Science')."),
  topic: z.string().describe("The topic for the worksheet (e.g., 'The Solar System')."),
  numQuestions: z.string().describe("The number of questions to generate for the worksheet."),
});
export type GenerateWorksheetInput = z.infer<typeof GenerateWorksheetInputSchema>;

const GenerateWorksheetOutputSchema = z.object({
  worksheet: z.string().describe('The generated worksheet in Markdown format, including a title, instructions, and questions.'),
});
export type GenerateWorksheetOutput = z.infer<typeof GenerateWorksheetOutputSchema>;

export async function generateWorksheet(
  input: GenerateWorksheetInput
): Promise<GenerateWorksheetOutput> {
  return generateWorksheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorksheetPrompt',
  input: {schema: GenerateWorksheetInputSchema},
  output: {schema: GenerateWorksheetOutputSchema},
  prompt: `You are an expert teacher's assistant. Your task is to create a well-structured worksheet based on the provided details.

**Grade Level:** {{{grade}}}
**Subject:** {{{subject}}}
**Topic:** {{{topic}}}
**Number of Questions:** {{{numQuestions}}}

Please generate a worksheet that includes:
1. A clear title.
2. Simple instructions for the student.
3. {{{numQuestions}}} questions that are appropriate for the specified grade level and topic.
4. An answer key at the end.

The entire output should be in Markdown format.
`,
});

const generateWorksheetFlow = ai.defineFlow(
  {
    name: 'generateWorksheetFlow',
    inputSchema: GenerateWorksheetInputSchema,
    outputSchema: GenerateWorksheetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
