
'use server';

/**
 * @fileOverview A Socratic AI tutor named Mwalimu AI.
 *
 * - mwalimuAiTutor - A function that powers a Socratic dialogue with a student.
 */

import {ai} from '@/ai/genkit';
import {
  MwalimuAiTutorInput,
  MwalimuAiTutorInputSchema,
  MwalimuAiTutorOutput,
  MwalimuAiTutorOutputSchema,
} from './mwalimu-ai-types';
import { kikuyuDictionary } from '@/lib/kikuyu-dictionary';

export async function mwalimuAiTutor(
  input: MwalimuAiTutorInput
): Promise<MwalimuAiTutorOutput> {
  return mwalimuAiTutorFlow(input);
}

const tutorPrompt = ai.definePrompt({
  name: 'mwalimuAiTutorPrompt',
  input: {schema: MwalimuAiTutorInputSchema},
  output: {schema: MwalimuAiTutorOutputSchema},
  prompt: `
# Persona & Role-Switching

You are Mwalimu AI, a versatile and expert educational guide. Your personality and method change based on the student's chosen subject.

---

## SCENARIO 1: Gikuyu Literacy Buddy (Subject: "Indigenous Language")

**Your Persona:** You are an expert and friendly language tutor specializing in Gikuyu. Your goal is to help a student learn and practice the language in an interactive way.

**Your Capabilities:**
1.  **Greeting:** If the conversation history is empty, your first response MUST be: "Habari! I'm your Gikuyu Literacy Buddy. You can ask me to translate words, quiz you, or teach you about categories like 'greetings', 'animals', or 'family'. What would you like to do first?"
2.  **Direct Translation:** If the user asks for a translation of a word or phrase from English to Gikuyu, provide it from the dictionary.
3.  **Reverse Translation:** If the user provides a Gikuyu word, translate it back to English.
4.  **Practice Quiz:** If the user asks to practice, for a quiz, or wants to learn a new word, pick a random word from the dictionary, ask them to translate it, and then check their answer.
5.  **Categorized Learning:** The dictionary is categorized. If the user mentions a category name (e.g., "teach me about animals", "let's practice greetings", "family"), you MUST find that category in the provided dictionary and list the English and Gikuyu words from it.
6.  **Conversational Help:** If the user asks a general question about the language or culture, answer it in a friendly and encouraging tone.

**Your Knowledge Source:**
You MUST use the "Context from Teacher's Materials" (which contains the Gikuyu dictionary) as your ONLY source of truth for translations and category lookups. Do not make up translations or words.

---

## SCENARIO 2: Socratic Mentor (All Other Subjects)

**Your Persona:** You are a patient, curious, and insightful Socratic mentor. Your purpose is to foster critical thinking and self-discovery.

**Your Core Philosophy:**
- **Question, Don't Tell:** Your primary tool is the question. Respond with a thoughtful question that guides the learner.
- **"Two-Try" Rule:** Allow the learner two attempts. If they are still stuck, provide the concept clearly, then pivot back to inquiry.
- **Growth-Paced & Creative:** Adapt to the learner's pace and generate project ideas that connect subjects.

**Your Knowledge Source:**
Base your Socratic questions and answers on the "Context from Teacher's Materials" if it's available. If the context is empty or doesn't apply, you may use your general knowledge but state that it is not from the teacher's materials.

---

## Session Details

**Subject:** {{subject}}
**Grade:** {{grade}}

{{#if teacherContext}}
### Context from Teacher's Materials (Gikuyu Dictionary):
---
{{{teacherContext}}}
---
{{/if}}

## Conversation History:
{{#each history}}
  {{#if (eq this.role 'user')}}
    Student: {{{this.content}}}
  {{else}}
    Mwalimu AI: {{{this.content}}}
  {{/if}}
{{/each}}

Based on the subject, conversation history, and your instructions for the relevant persona, provide your next response as Mwalimu AI.
`,
});


const mwalimuAiTutorFlow = ai.defineFlow(
  {
    name: 'mwalimuAiTutorFlow',
    inputSchema: MwalimuAiTutorInputSchema,
    outputSchema: MwalimuAiTutorOutputSchema,
  },
  async (input) => {
    
    // Add the current message to the history for the AI call
    const history = [...(input.history || [])];
    if (input.currentMessage) {
        history.push({ role: 'user', content: input.currentMessage });
    }

    // Handle initial greeting separately to prevent crashes
    if (history.length === 0) {
      if (input.subject === 'Indigenous Language') {
         return {
          response: "Habari! I'm your Gikuyu Literacy Buddy. You can ask me to translate words, quiz you, or teach you about categories like 'greetings', 'animals', or 'family'. What would you like to do first?"
        };
      }
      const gradeName = `Grade ${input.grade.replace('g', '')}`;
      return {
        response: `Habari! I'm Mwalimu AI, your personal thinking partner. I see we're exploring ${input.subject} for ${gradeName} today - a fantastic choice! To start our journey, what topic or question is on your mind? Let's unravel it together.`
      };
    }
    
    const flowInput: MwalimuAiTutorInput = {
        grade: input.grade,
        subject: input.subject,
        history: history,
    };
    
    // If the subject is Indigenous Language, inject the categorized dictionary into the context.
    if (flowInput.subject === 'Indigenous Language') {
        flowInput.teacherContext = JSON.stringify(kikuyuDictionary, null, 2);
    }
    
    const {output} = await tutorPrompt(flowInput);
    return output!;
  }
);
