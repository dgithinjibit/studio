'use server';

/**
 * @fileOverview Generates a summary of an AI-generated report for a school, for county officers.
 *
 * - generateReportSummary - A function that generates the report summary.
 * - GenerateReportSummaryInput - The input type for the generateReportSummary function.
 * - GenerateReportSummaryOutput - The return type for the generateReportSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportSummaryInputSchema = z.object({
  reportText: z
    .string()
    .describe('The complete text of the AI-generated report.'),
});
export type GenerateReportSummaryInput = z.infer<
  typeof GenerateReportSummaryInputSchema
>;

const GenerateReportSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the AI-generated report.'),
});
export type GenerateReportSummaryOutput = z.infer<
  typeof GenerateReportSummaryOutputSchema
>;

export async function generateReportSummary(
  input: GenerateReportSummaryInput
): Promise<GenerateReportSummaryOutput> {
  return generateReportSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportSummaryPrompt',
  input: {schema: GenerateReportSummaryInputSchema},
  output: {schema: GenerateReportSummaryOutputSchema},
  prompt: `You are an AI expert in summarizing educational reports for county officers in Kenya.

  Given the following AI-generated report, create a concise summary highlighting key findings and recommendations.

  Report:
  {{reportText}}

  Summary:`,
});

const generateReportSummaryFlow = ai.defineFlow(
  {
    name: 'generateReportSummaryFlow',
    inputSchema: GenerateReportSummaryInputSchema,
    outputSchema: GenerateReportSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
