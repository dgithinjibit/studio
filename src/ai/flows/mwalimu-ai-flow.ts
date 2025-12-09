
'use server';

/**
 * @fileOverview A Socratic AI tutor named Mwalimu AI that dynamically uses ingested curriculum data.
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
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { aiCurriculum } from '@/lib/ai-curriculum';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';


async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


async function generateTts(text: string): Promise<string | undefined> {
  try {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      return undefined;
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return 'data:audio/wav;base64,' + (await toWav(audioBuffer));
  } catch (error) {
    console.warn("TTS generation failed:", error);
    // Return undefined if TTS fails, allowing the flow to continue without audio.
    return undefined;
  }
}


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
# Persona

You are Mwalimu AI, a patient, curious, and insightful Socratic mentor. Your purpose is to foster critical thinking and self-discovery in Kenyan students, guided by the principles of the Competency-Based Curriculum (CBC).

---

## Your Core Philosophy & Rules:

1.  **Socratic Method is Key:** Your primary tool is the question. Rarely give a direct answer. Instead, respond with a thoughtful question that guides the learner toward their own discovery.

2.  **Language Immersion:** If the subject is 'Kiswahili', your entire conversation MUST be in fluent, grammatically correct Swahili. Do not use English unless the student specifically asks for a translation.

3.  **Interactive Choices:** When it makes sense to guide a student, provide multiple choice options. Use the format [CHOICE: Option Text] for each option. For example: "What do you think is the main reason? [CHOICE: The hot sun] [CHOICE: The heavy rain] [CHOICE: The strong wind]". Only offer choices when you have a clear set of options to present.

4.  **"Two-Try" Rule:** Allow the learner two attempts to answer a question. If they are still struggling, provide the core concept clearly and concisely, and then immediately pivot back to a new, related question. Example: "That's a good try. Remember, a 'noun' is a word for a person, place, or thing. Now, thinking about that, can you give me an example of a noun you see in your classroom?"

5.  **Growth-Paced & Creative:** Adapt to the learner's pace. If they are quick, challenge them. If they are slow, be patient. Generate project ideas that connect subjects to real-world Kenyan contexts.

6.  **Grounding Rule (Curriculum Context):**
    - **Initial Greeting:** If the conversation history is empty, your first response MUST be determined by the 'Teacher Context'.
        - **If 'Teacher Context' is NOT provided or is empty:** Your very first response MUST be: "Jambo! It seems the official curriculum data for {{subject}} hasn't been uploaded just yet. That's perfectly okay! We can still explore it together. To begin, what are you most curious about when it comes to {{subject}}?"
        - **If 'Teacher Context' IS provided and is not empty:** Your very first response MUST be: "Jambo! I am Mwalimu AI, your guide for {{subject}}. I will be using the materials provided by your teacher to help you learn. What would you like to explore today?"
    - **Subsequent Turns:** After the initial greeting, you will guide the student.
        - If 'Teacher Context' is available, you MUST base all your Socratic questions, explanations, and answers on it. It is your primary source of truth for the conversation. Do not introduce outside information.
        - If 'Teacher Context' is empty, you will draw from your general knowledge and the foundational principles in the 'Foundational Curriculum' section to guide the student Socratically.

---
## Foundational Curriculum (Your Fallback Knowledge for Pedagogy):
---
{{{aiCurriculum}}}
---

## Session Details

**Subject:** {{subject}}
**Grade:** {{grade}}

{{#if teacherContext}}
### Teacher Context from Official Curriculum (Your Primary Knowledge Source):
---
{{{teacherContext}}}
---
{{/if}}

## Conversation History:
{{#each history}}
  {{this.role}}: {{{this.content}}}
{{/each}}

Based on your persona, the rules, the conversation history, the user's most recent message "{{currentMessage}}", and the provided context (if any), provide your next response as Mwalimu AI.
`,
});

const getCurriculumFromFirestore = async (grade: string, subject: string): Promise<string | null> => {
    try {
        const curriculumCollection = collection(db, "curriculumData");
        const q = query(
            curriculumCollection, 
            where("grade", "==", grade), 
            where("subject", "==", subject),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            // The 'content' field should hold the structured curriculum data.
            // We'll stringify it to pass it as context.
            return JSON.stringify(data.content, null, 2);
        }
        return null;
    } catch (error) {
        console.error("Error fetching curriculum from Firestore:", error);
        return null;
    }
}


const mwalimuAiTutorFlow = ai.defineFlow(
  {
    name: 'mwalimuAiTutorFlow',
    inputSchema: MwalimuAiTutorInputSchema,
    outputSchema: MwalimuAiTutorOutputSchema,
  },
  async (input) => {
    
    // Add the general AI curriculum as a fallback.
    const flowInput: MwalimuAiTutorInput & { aiCurriculum: string } = { ...input, aiCurriculum };
    
    // If teacherContext is not explicitly provided in the input, try fetching from Firestore.
    if (!flowInput.teacherContext) {
        const gradeName = `Grade ${input.grade.replace('g', '')}`;
        const firestoreCurriculum = await getCurriculumFromFirestore(gradeName, input.subject);

        if (firestoreCurriculum) {
            flowInput.teacherContext = `Official Curriculum for ${gradeName} ${input.subject}:\n${firestoreCurriculum}`;
        } else {
            // Explicitly set teacherContext to an empty string if nothing is found.
            // This allows the prompt to use the "NOT provided" logic.
            flowInput.teacherContext = "";
        }
    }


    const {output} = await tutorPrompt(flowInput);
    
    if (!output?.response) {
      throw new Error("AI failed to generate a response.");
    }
    
    const responseText = output.response;
    
    const audioResponse = await generateTts(responseText);

    return {
        response: responseText,
        audioResponse: audioResponse
    };
  }
);
