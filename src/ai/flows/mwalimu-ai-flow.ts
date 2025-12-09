
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

// Import local curriculum data
import { grade4CreCurriculum } from '@/curriculum/grade4-cre';
import { grade4SocialStudiesCurriculum } from '@/curriculum/grade4-social-studies';
import { grade4AgricultureAndNutritionCurriculum } from '@/curriculum/grade4-agriculture-and-nutrition';
import { grade1CreCurriculum } from '@/curriculum/grade1-cre';
import { grade2CreCurriculum } from '@/curriculum/grade2-cre';
import { grade3CreCurriculum } from '@/curriculum/grade3-cre';
import { grade4CreativeArtsCurriculum } from '@/curriculum/grade4-creative-arts';
import { grade5CreativeArtsCurriculum } from '@/curriculum/grade5-creative-arts';
import { grade6SocialStudiesCurriculum } from '@/curriculum/grade6-social-studies';
import { grade1EnvironmentalActivitiesCurriculum } from '@/curriculum/grade1-environmental-activities';
import { grade2EnvironmentalActivitiesCurriculum } from '@/curriculum/grade2-environmental-activities';
import { grade3EnvironmentalActivitiesCurriculum } from '@/curriculum/grade3-environmental-activities';


const localCurriculumMap: Record<string, any> = {
    'Grade 4-Christian Religious Education': grade4CreCurriculum,
    'Grade 4-Social Studies': grade4SocialStudiesCurriculum,
    'Grade 4-Agriculture and Nutrition': grade4AgricultureAndNutritionCurriculum,
    'Grade 1-Christian Religious Education': grade1CreCurriculum,
    'Grade 2-Christian Religious Education': grade2CreCurriculum,
    'Grade 3-Christian Religious Education': grade3CreCurriculum,
    'Grade 4-Creative Arts': grade4CreativeArtsCurriculum,
    'Grade 5-Creative Arts': grade5CreativeArtsCurriculum,
    'Grade 6-Social Studies': grade6SocialStudiesCurriculum,
    'Grade 1-Environmental Activities': grade1EnvironmentalActivitiesCurriculum,
    'Grade 2-Environmental Activities': grade2EnvironmentalActivitiesCurriculum,
    'Grade 3-Environmental Activities': grade3EnvironmentalActivitiesCurriculum,
};


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
    let firestoreCurriculum = await getCurriculumFromFirestore(gradeName, input.subject);

    // If Firestore has no data, fall back to the local curriculum map.
    if (!firestoreCurriculum) {
        const localKey = `${gradeName}-${input.subject}`;
        const localData = localCurriculumMap[localKey];
        if (localData) {
            firestoreCurriculum = JSON.stringify(localData, null, 2);
        }
    }
    
    // GUARD CLAUSE: If no curriculum is found in Firestore OR locally, return a helpful message.
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
