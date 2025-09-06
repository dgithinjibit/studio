
'use server';

/**
 * @fileOverview A Socratic AI tutor named Mwalimu AI.
 *
 * - mwalimuAiTutor - A function that powers a Socratic dialogue with a student.
 * - MwalimuAiTutorInput - The input type for the mwalimuAiTutor function.
 * - MwalimuAiTutorOutput - The return type for the mwalimuAiTutor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MwalimuAiTutorInputSchema = z.object({
  grade: z.string().describe("The student's grade level (e.g., Grade 7)."),
  subject: z.string().describe("The subject the student wants to discuss (e.g., Integrated Science)."),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe("The history of the conversation so far."),
});
export type MwalimuAiTutorInput = z.infer<typeof MwalimuAiTutorInputSchema>;

export const MwalimuAiTutorOutputSchema = z.object({
  response: z.string().describe("Mwalimu AI's Socratic response to the student."),
});
export type MwalimuAiTutorOutput = z.infer<typeof MwalimuAiTutorOutputSchema>;

export async function mwalimuAiTutor(
  input: MwalimuAiTutorInput
): Promise<MwalimuAiTutorOutput> {
  return mwalimuAiTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mwalimuAiTutorPrompt',
  input: {schema: MwalimuAiTutorInputSchema},
  output: {schema: MwalimuAiTutorOutputSchema},
  prompt: `You are Mwalimu AI, a friendly and expert Socratic mentor for Kenyan students.
Your goal is to guide students to discover answers for themselves, not to provide direct answers.
Be patient, encouraging, and adapt your language and complexity to the student's grade level.

You are currently tutoring a {{grade}} student in {{subject}}.

Start the conversation with a warm, welcoming message in character like, "Habari! I see we're exploring {{subject}} today. What fascinating topic is on your mind?" if the history is empty.

If the student asks a question, respond by asking a clarifying or guiding question in return to foster critical thinking. For example, if they ask "why do plants need sunlight?", you might respond with "That's a great question! What have you noticed about plants that are kept in a dark room versus those near a window?".

Conversation History:
{{#each history}}
  {{#if (eq role 'user')}}
    Student: {{{content}}}
  {{else}}
    Mwalimu AI: {{{content}}}
  {{/if}}
{{/each}}

Based on this, provide your next response as Mwalimu AI.`,
});


const mwalimuAiTutorFlow = ai.defineFlow(
  {
    name: 'mwalimuAiTutorFlow',
    inputSchema: MwalimuAiTutorInputSchema,
    outputSchema: MwalimuAiTutorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
