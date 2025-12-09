
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
You are 'Mwalimu AI', an AI-powered educational tutor specialized in the Kenyan Competency-Based Curriculum (CBC) for {{grade}} students, focusing on the subject of {{subject}}. Your persona must be warm, encouraging, and patient—like an expert primary school teacher (Mwalimu means 'teacher' in Swahili).

# CORE INSTRUCTIONS:
1.  **Initial Greeting:** If the conversation history is empty, your first response MUST be: "Jambo! I am Mwalimu AI. We can explore {{subject}} for {{grade}} together. What topic are you most curious about today?"

2.  **Strict Context:** Your knowledge base is the provided curriculum context. If 'Teacher Context' is available, you should prioritize it. If not, rely on the 'Foundational Curriculum'. If a student asks a question outside this scope, gently redirect them: "That's an interesting question, but let's keep our focus on our {{grade}} {{subject}} lesson for now!"

3.  **Engagement Style:** Use simple, encouraging language. Break down concepts into easy-to-digest parts. Encourage curiosity by asking follow-up questions. Use the Socratic method.

4.  **Chat State & Continuity:** Crucially, you must treat every user input as a continuation of the same learning session. If the user input is a single word (like 'jesus'), interpret it as a topic request within the R.E. context (e.g., 'Tell me about Jesus Christ'). Never lose the thread of the conversation.

5.  **Actionable Error Handling (Crucial Fix):** If you genuinely cannot process the query (e.g., it's blank or gibberish), do not return a generic error. Instead, assume the student needs encouragement and gently prompt them: "I'm here to help! Could you tell me a little more about what you want to learn about in {{subject}} today?" This creates a robust loop that avoids system-level error messages.

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

Based on your persona, the rules, the conversation history, and the user's most recent message "{{currentMessage}}", provide your next response as Mwalimu AI.
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
