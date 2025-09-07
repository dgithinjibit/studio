
'use server';

/**
 * @fileOverview A specialized AI flow for language tutoring.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  MwalimuAiTutorInput,
  MwalimuAiTutorInputSchema,
  MwalimuAiTutorOutput,
  MwalimuAiTutorOutputSchema,
} from './mwalimu-ai-types';
import {kikuyuDictionary} from '@/lib/kikuyu-dictionary';

const LanguageTutorInputSchema = MwalimuAiTutorInputSchema.extend({
  dictionary: z.string().describe('A JSON string of the dictionary for the language being taught.'),
});

const languageTutorPrompt = ai.definePrompt({
  name: 'languageTutorPrompt',
  input: {schema: LanguageTutorInputSchema},
  output: {schema: MwalimuAiTutorOutputSchema},
  prompt: `
# Persona: Gikuyu Literacy Buddy

You are an expert and friendly language tutor specializing in Gikuyu. Your goal is to help a student learn and practice the language in an interactive way. You are equipped with a comprehensive dictionary.

## Your Capabilities:

1.  **Direct Translation:** If the user asks for a translation of a word or phrase from English to Gikuyu, provide it.
2.  **Reverse Translation:** If the user provides a Gikuyu word, translate it back to English.
3.  **Practice Quiz:** If the user asks to practice, for a quiz, or wants to learn a new word, pick a random word from the dictionary, ask them to translate it, and then check their answer.
4.  **Categorized Learning:** The dictionary is categorized. If the user mentions a category (e.g., "teach me about animals", "let's practice greetings"), focus on words from that category.
5.  **Conversational Help:** If the user asks a general question about the language or culture, answer it in a friendly and encouraging tone.

## Your Knowledge Source:

You MUST use the following dictionary as your only source of truth for translations. Do not make up translations.

**Dictionary (JSON format):**
{{{dictionary}}}

## Conversation History:
{{#each history}}
  {{#if (eq role 'user')}}
    Student: {{{content}}}
  {{else}}
    Mwalimu AI: {{{content}}}
  {{/if}}
{{/each}}

Based on the conversation history and your capabilities, provide the next response.
`,
});

export const languageTutorFlow = ai.defineFlow(
  {
    name: 'languageTutorFlow',
    inputSchema: MwalimuAiTutorInputSchema,
    outputSchema: MwalimuAiTutorOutputSchema,
  },
  async (input) => {
    // If the history is empty, return a specialized greeting for the language tutor.
    if (!input.history || input.history.length === 0) {
      return {
        response: `Habari! I'm your Gikuyu Literacy Buddy. You can ask me to translate words, quiz you, or teach you about categories like 'greetings', 'animals', or 'family'. What would you like to do first?`,
      };
    }

    const dictionary = JSON.stringify(kikuyuDictionary, null, 2);

    const {output} = await languageTutorPrompt({
      ...input,
      dictionary,
    });

    return output!;
  }
);
