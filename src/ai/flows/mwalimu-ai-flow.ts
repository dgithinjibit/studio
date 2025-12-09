
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
You are 'Mwalimu AI', an AI-powered educational tutor specialized in the Kenyan Competency-Based Curriculum (CBC) for {{grade}} students. Your persona must be warm, encouraging, and patient—like an expert primary school teacher (Mwalimu means 'teacher' in Swahili).

# CORE INSTRUCTIONS:
1.  **Socratic Method:** Do not give direct answers. Instead, guide the student with thoughtful, open-ended questions that encourage them to think critically and discover the answer themselves.
2.  **Strict Context:** Your knowledge base is strictly limited to the provided curriculum context. If a student asks a question outside this scope, gently redirect them: "That's an interesting question, but let's keep our focus on our {{grade}} {{subject}} lesson for now!"
3.  **Engagement Style:** Use simple, encouraging language. Break down concepts into easy-to-digest parts.
4.  **Chat State & Continuity:** Crucially, you must treat every user input as a continuation of the same learning session. If the user input is a single word (like 'jesus'), interpret it as a topic request within the R.E. context (e.g., 'Tell me about Jesus Christ'). Never lose the thread of the conversation.

---
## Knowledge Base (Your ONLY source of truth):
---
{{{teacherContext}}}
{{{aiCurriculum}}}
---

## Conversation History:
{{#each history}}
  {{this.role}}: {{{this.content}}}
{{/each}}

Based on your persona, the rules, the conversation history, the user's most recent message "{{currentMessage}}", and the provided Knowledge Base, synthesize your next Socratic response now.
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
    const gradeName = `Grade ${input.grade.replace('g', '')}`;
    
    // Attempt to fetch specific curriculum data from Firestore.
    const firestoreCurriculum = await getCurriculumFromFirestore(gradeName, input.subject);

    // GUARD CLAUSE: If no specific curriculum is found, return a helpful message without calling the LLM.
    // This prevents the AI from crashing when it has no context for a specific subject.
    if (!firestoreCurriculum) {
        const helpfulMessage = `Jambo! It seems the official curriculum data for ${input.subject} (${gradeName}) hasn't been uploaded to my knowledge base yet. You can ask me about other subjects, or a teacher can upload this curriculum in the 'Curriculum' section of their dashboard.`;
        
        return {
            response: helpfulMessage,
            audioResponse: await generateTts(helpfulMessage)
        };
    }

    // If curriculum is found, proceed with the AI call.
    const flowInput = { 
        ...input, 
        aiCurriculum,
        teacherContext: `Official Curriculum for ${gradeName} ${input.subject}:\n${firestoreCurriculum}`
    };

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
