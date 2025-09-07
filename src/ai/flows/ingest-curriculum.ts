
'use server';

/**
 * @fileOverview An AI agent to ingest and parse curriculum documents.
 * 
 * This flow takes raw text from a curriculum document and transforms it
 * into a structured JSON object that can be used by other AI agents.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurriculumStructureSchema = z.object({
    strand: z.string(),
    subStrand: z.string(),
    learningOutcomes: z.array(z.string()),
    learningExperiences: z.array(z.string()),
    keyInquiryQuestions: z.array(z.string()),
});

const IngestCurriculumInputSchema = z.object({
  documentText: z.string().describe("The raw text copied from a curriculum PDF document."),
  majorLevel: z.string().describe("The major educational level, e.g., 'Early Years Education'."),
  subLevel: z.string().describe("The sub-level, e.g., 'Lower Primary'."),
  grade: z.string().describe("The grade level for the curriculum, e.g., 'Grade 3'."),
  subject: z.string().describe("The subject for the curriculum, e.g., 'English Language Activities'."),
});
export type IngestCurriculumInput = z.infer<typeof IngestCurriculumInputSchema>;

const IngestCurriculumOutputSchema = z.object({
  parsedCurriculum: z.array(CurriculumStructureSchema).describe("An array of structured curriculum objects extracted from the document."),
});
export type IngestCurriculumOutput = z.infer<typeof IngestCurriculumOutputSchema>;


export async function ingestCurriculum(
  input: IngestCurriculumInput
): Promise<IngestCurriculumOutput> {
  // If there's no document text, we can't parse anything.
  // This will be the case until we add PDF text extraction.
  // Returning immediately makes the upload process much faster for the user.
  if (!input.documentText) {
    return { parsedCurriculum: [] };
  }
  
  return ingestCurriculumFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ingestCurriculumPrompt',
  input: {schema: IngestCurriculumInputSchema},
  output: {schema: IngestCurriculumOutputSchema},
  prompt: `You are an expert at parsing structured documents. Your task is to analyze the provided text from a curriculum document and extract the key information into a structured JSON format.

The document contains tables with columns like: "Strand", "Sub strand", "Specific Learning Outcomes", "Suggested Learning Experiences", and "Key Inquiry Question(s)".

Carefully read the text provided and extract each row of curriculum content into a separate object.

**Document Text:**
---
{{documentText}}
---
`,
});

const ingestCurriculumFlow = ai.defineFlow(
  {
    name: 'ingestCurriculumFlow',
    inputSchema: IngestCurriculumInputSchema,
    outputSchema: IngestCurriculumOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
