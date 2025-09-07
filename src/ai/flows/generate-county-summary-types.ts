/**
 * @fileOverview Types for the generate-county-summary flow.
 */
import {z} from 'genkit';

export const GenerateCountySummaryInputSchema = z.object({
  schoolCount: z.number().describe("The total number of schools in the county."),
  studentCount: z.number().describe("The total number of students in the county."),
  teacherCount: z.number().describe("The total number of teachers in the county."),
  averagePerformance: z.number().describe("The county-wide average student performance percentage."),
  topPerformingSchool: z.string().describe("The name of the top-performing school."),
  lowestPerformingSchool: z.string().describe("The name of the lowest-performing school."),
});
export type GenerateCountySummaryInput = z.infer<typeof GenerateCountySummaryInputSchema>;

export const GenerateCountySummaryOutputSchema = z.object({
  summary: z.string().describe('A brief, 2-sentence summary of the county\'s educational status.'),
  suggestion: z.string().describe('A single, actionable, strategic suggestion for the County Director.'),
});
export type GenerateCountySummaryOutput = z.infer<typeof GenerateCountySummaryOutputSchema>;
