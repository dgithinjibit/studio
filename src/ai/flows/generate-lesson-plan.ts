
'use server';

/**
 * @fileOverview AI agent to generate a draft lesson plan from a prompt, optionally using a Scheme of Work as context.
 *
 * - generateLessonPlan - A function that handles the lesson plan generation process.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  subject: z.string().describe('The subject of the lesson plan.'),
  topic: z.string().describe('The specific topic of the lesson plan.'),
  gradeLevel: z.string().describe('The grade level for the lesson plan.'),
  learningObjectives: z
    .string()
    .describe('The learning objectives for the lesson plan.'),
  strand: z.string().optional().describe('The main curriculum strand.'),
  subStrand: z.string().optional().describe('The curriculum sub-strand.'),
  teacherName: z.string().optional().describe("The teacher's name."),
  school: z.string().optional().describe('The name of the school.'),
  term: z.string().optional().describe('The school term.'),
  year: z.string().optional().describe('The academic year.'),
  roll: z
    .string()
    .optional()
    .describe('The number of students (e.g., "Boys: 20, Girls: 20").'),
  schemeOfWorkContext: z
    .string()
    .optional()
    .describe('The full Markdown content of the relevant Scheme of Work for context.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const GenerateLessonPlanOutputSchema = z.object({
  lessonPlan: z.string().describe('The generated lesson plan in a document format.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(
  input: GenerateLessonPlanInput
): Promise<GenerateLessonPlanOutput> {
    return generateLessonPlanFlow(input);
}

const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'generateLessonPlanPrompt',
      input: {schema: GenerateLessonPlanInputSchema},
      output: {schema: GenerateLessonPlanOutputSchema},
      prompt: `You are an expert Kenyan CBC curriculum developer.

      {{#if schemeOfWorkContext}}
      ---
      **CONTEXT: SCHEME OF WORK**
      You MUST use the following Scheme of Work as the primary source of truth to create a lesson plan document.
      {{{schemeOfWorkContext}}}
      ---
      {{/if}}

      **CRITICAL FORMATTING INSTRUCTIONS:**
      The final output MUST be a well-structured document. Do NOT use Markdown tables.
      Use Markdown headings (##), bold text, and bullet points for structure.

      ## Administrative Details
      - **School:** {{#if school}}{{school}}{{else}}Grace View Primary School{{/if}}
      - **Year:** {{#if year}}{{year}}{{else}}2025{{/if}}
      - **Term:** {{#if term}}{{term}}{{else}}2{{/if}}
      - **Roll:** {{#if roll}}{{roll}}{{else}}Boys: 20, Girls: 20{{/if}}
      - **Teacher:** {{#if teacherName}}{{teacherName}}{{else}}Daniel{{/if}}
      - **Subject:** {{subject}}
      - **Date:** {{current_date format="DD/MM/YYYY"}}
      - **Time:** [Specify Time]

      ## Lesson Details
      - **Strand:** {{#if strand}}{{strand}}{{else}}[Extract from Scheme]{{/if}}
      - **Sub Strand:** {{#if subStrand}}{{subStrand}}{{else}}[Extract from Scheme]{{/if}}
      - **Learning Outcomes:** By the end of the lesson, the learner should be able to:
          - {{#if schemeOfWorkContext}}[Analyze and list the specific learning outcomes from the scheme]{{else}}{{{learningObjectives}}}{{/if}}
      - **Key Inquiry Question(s):**
          - {{#if schemeOfWorkContext}}[Extract the key inquiry questions from the scheme]{{else}}[Generate relevant questions]{{/if}}

      ## Learning Resources
      - {{#if schemeOfWorkContext}}[List all resources mentioned in the Scheme of Work]{{else}}[List relevant resources]{{/if}}

      ## Organization of Learning

      ### Introduction (5 Minutes)
      - [Detail an engaging introduction. How will you link to the previous lesson? What is the hook?]

      ### Lesson Development (25 Minutes)
      - **Step 1:** [Describe the first activity. What will the teacher do? What will the learner do?]
      - **Step 2:** [Describe the second activity.]
      - **Step 3:** [Describe the third activity.]

      ### Conclusion (5 Minutes)
      - [How will you summarize the key points and assess understanding?]

      ## Extended Activity
      - [Suggest a brief, relevant activity for learners to do at home or after the lesson.]

      ## Teacher's Reflection
      - [This section MUST be left blank for the teacher to fill in.]`,
    });

    const {output} = await prompt(input);
    return output!;
  }
);
