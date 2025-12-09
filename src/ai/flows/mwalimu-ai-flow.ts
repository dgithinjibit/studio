
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
import { grade1CreCurriculum } from '@/curriculum/grade1-cre';
import { grade1CreativeActivitiesCurriculum } from '@/curriculum/grade1-creative-activities';
import { grade1EnglishLanguageActivitiesCurriculum } from '@/curriculum/grade1-english-language-activities';
import { grade1EnvironmentalActivitiesCurriculum } from '@/curriculum/grade1-environmental-activities';
import { grade1IndigenousLanguageCurriculum } from '@/curriculum/grade1-indigenous-language';
import { grade1KiswahiliLanguageActivitiesCurriculum } from '@/curriculum/grade1-kiswahili-language-activities';
import { grade1MathematicsActivitiesCurriculum } from '@/curriculum/grade1-mathematics-activities';

import { grade2CreCurriculum } from '@/curriculum/grade2-cre';
import { grade2CreativeActivitiesCurriculum } from '@/curriculum/grade2-creative-activities';
import { grade2EnglishLanguageActivitiesCurriculum } from '@/curriculum/grade2-english-language-activities';
import { grade2EnvironmentalActivitiesCurriculum } from '@/curriculum/grade2-environmental-activities';
import { grade2IndigenousLanguageCurriculum } from '@/curriculum/grade2-indigenous-language';
import { grade2KiswahiliLanguageActivitiesCurriculum } from '@/curriculum/grade2-kiswahili-language-activities';
import { grade2MathematicsActivitiesCurriculum } from '@/curriculum/grade2-mathematics-activities';

import { grade3CreCurriculum } from '@/curriculum/grade3-cre';
import { grade3CreativeActivitiesCurriculum } from '@/curriculum/grade3-creative-activities';
import { grade3EnglishLanguageActivitiesCurriculum } from '@/curriculum/grade3-english-language-activities';
import { grade3EnvironmentalActivitiesCurriculum } from '@/curriculum/grade3-environmental-activities';
import { grade3IndigenousLanguageCurriculum } from '@/curriculum/grade3-indigenous-language';
import { grade3KiswahiliLanguageActivitiesCurriculum } from '@/curriculum/grade3-kiswahili-language-activities';
import { grade3MathematicsActivitiesCurriculum } from '@/curriculum/grade3-mathematics-activities';

import { grade4CreCurriculum } from '@/curriculum/grade4-cre';
import { grade4SocialStudiesCurriculum } from '@/curriculum/grade4-social-studies';
import { grade4AgricultureAndNutritionCurriculum } from '@/curriculum/grade4-agriculture-and-nutrition';
import { grade4CreativeArtsCurriculum } from '@/curriculum/grade4-creative-arts';
import { grade4EnglishLanguageActivitiesCurriculum } from '@/curriculum/grade4-english-language-activities';
import { grade4IndigenousLanguageCurriculum } from '@/curriculum/grade4-indigenous-language';
import { grade4KiswahiliLanguageActivitiesCurriculum } from '@/curriculum/grade4-kiswahili-language-activities';
import { grade4ReligiousEducationCurriculum } from '@/curriculum/grade4-religious-education';


import { grade5CreativeArtsCurriculum } from '@/curriculum/grade5-creative-arts';
import { grade6SocialStudiesCurriculum } from '@/curriculum/grade6-social-studies';

import { pp1CreCurriculum } from '@/curriculum/pp1-cre';
import { pp1CreativeArtsCurriculum } from '@/curriculum/pp1-creative-arts';
import { pp1EnvironmentalActivitiesCurriculum } from '@/curriculum/pp1-environmental-activities';
import { pp1LanguageActivitiesCurriculum } from '@/curriculum/pp1-language-activities';
import { pp1MathematicsActivitiesCurriculum } from '@/curriculum/pp1-mathematics-activities';

import { pp2CreCurriculum } from '@/curriculum/pp2-cre';
import { pp2CreativeArtsCurriculum } from '@/curriculum/pp2-creative-arts';
import { pp2EnvironmentalActivitiesCurriculum } from '@/curriculum/pp2-environmental-activities';
import { pp2LanguageActivitiesCurriculum } from '@/curriculum/pp2-language-activities';
import { pp2MathematicsActivitiesCurriculum } from '@/curriculum/pp2-mathematics-activities';


const localCurriculumMap: Record<string, any> = {
    // PP1
    'PP1-Christian Religious Education': pp1CreCurriculum,
    'PP1-Creative Activities': pp1CreativeArtsCurriculum,
    'PP1-Environmental Activities': pp1EnvironmentalActivitiesCurriculum,
    'PP1-Language Activities': pp1LanguageActivitiesCurriculum,
    'PP1-Mathematical Activities': pp1MathematicsActivitiesCurriculum,
    // PP2
    'PP2-Christian Religious Education': pp2CreCurriculum,
    'PP2-Creative Activities': pp2CreativeArtsCurriculum,
    'PP2-Environmental Activities': pp2EnvironmentalActivitiesCurriculum,
    'PP2-Language Activities': pp2LanguageActivitiesCurriculum,
    'PP2-Mathematical Activities': pp2MathematicsActivitiesCurriculum,
    // Grade 1
    'Grade 1-Christian Religious Education': grade1CreCurriculum,
    'Grade 1-Creative Activities': grade1CreativeActivitiesCurriculum,
    'Grade 1-English Language Activities': grade1EnglishLanguageActivitiesCurriculum,
    'Grade 1-Environmental Activities': grade1EnvironmentalActivitiesCurriculum,
    'Grade 1-Indigenous Language Activities': grade1IndigenousLanguageCurriculum,
    'Grade 1-Kiswahili Language Activities': grade1KiswahiliLanguageActivitiesCurriculum,
    'Grade 1-Mathematical Activities': grade1MathematicsActivitiesCurriculum,
    // Grade 2
    'Grade 2-Christian Religious Education': grade2CreCurriculum,
    'Grade 2-Creative Activities': grade2CreativeActivitiesCurriculum,
    'Grade 2-English Language Activities': grade2EnglishLanguageActivitiesCurriculum,
    'Grade 2-Environmental Activities': grade2EnvironmentalActivitiesCurriculum,
    'Grade 2-Indigenous Language Activities': grade2IndigenousLanguageCurriculum,
    'Grade 2-Kiswahili Language Activities': grade2KiswahiliLanguageActivitiesCurriculum,
    'Grade 2-Mathematical Activities': grade2MathematicsActivitiesCurriculum,
    // Grade 3
    'Grade 3-Christian Religious Education': grade3CreCurriculum,
    'Grade 3-Creative Activities': grade3CreativeActivitiesCurriculum,
    'Grade 3-English Language Activities': grade3EnglishLanguageActivitiesCurriculum,
    'Grade 3-Environmental Activities': grade3EnvironmentalActivitiesCurriculum,
    'Grade 3-Indigenous Language Activities': grade3IndigenousLanguageCurriculum,
    'Grade 3-Kiswahili Language Activities': grade3KiswahiliLanguageActivitiesCurriculum,
    'Grade 3-Mathematical Activities': grade3MathematicsActivitiesCurriculum,
    // Grade 4
    'Grade 4-Christian Religious Education': grade4CreCurriculum,
    'Grade 4-Religious Education': grade4ReligiousEducationCurriculum,
    'Grade 4-Social Studies': grade4SocialStudiesCurriculum,
    'Grade 4-Agriculture and Nutrition': grade4AgricultureAndNutritionCurriculum,
    'Grade 4-Creative Arts': grade4CreativeArtsCurriculum,
    'Grade 4-English': grade4EnglishLanguageActivitiesCurriculum,
    'Grade 4-Indigenous Languages': grade4IndigenousLanguageCurriculum,
    'Grade 4-Kiswahili': grade4KiswahiliLanguageActivitiesCurriculum,
    'Grade 4-Environmental Activities': grade3EnvironmentalActivitiesCurriculum, 
    // Grade 5
    'Grade 5-Creative Arts': grade5CreativeArtsCurriculum,
    // Grade 6
    'Grade 6-Social Studies': grade6SocialStudiesCurriculum,
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
2.  **Strict Context:** Your knowledge base is strictly limited to the provided curriculum context in the KNOWLEDGE_BASE section. If the user asks about something completely outside this scope, gently redirect them: "That's a very interesting question! For now, let's focus on our {{grade}} {{subject}} lesson to make sure we cover everything your teacher has planned."
3.  **Engagement Style:** Use simple, encouraging language. Break down concepts into easy-to-digest parts. Encourage curiosity by asking follow-up questions.
4.  **Chat State & Continuity:** Treat every user input as a continuation of the same learning session. If the user input is a single word (like 'jesus'), interpret it as a topic request within the R.E. context (e.g., 'Tell me about Jesus Christ'). Never lose the thread of the conversation.

---
## KNOWLEDGE_BASE (Your ONLY source of truth for this subject):
---
{{{knowledgeBase}}}
---

## Conversation History:
{{#each history}}
  {{this.role}}: {{{this.content}}}
{{/each}}

Based on your persona, the rules, the conversation history, the user's most recent message "{{currentMessage}}", and the provided KNOWLEDGE_BASE, provide your next Socratic response as Mwalimu AI.
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
    let knowledgeBase = '';

    try {
        // First, attempt to get data from Firestore
        const firestoreCurriculum = await getCurriculumFromFirestore(gradeName, input.subject);

        if (firestoreCurriculum) {
            knowledgeBase = firestoreCurriculum;
        } else {
            // If Firestore is empty, try the local map
            const localKey = `${gradeName}-${input.subject}`;
            const localData = localCurriculumMap[localKey];

            if (localData) {
                knowledgeBase = JSON.stringify(localData, null, 2);
            } else {
                // If both fail, throw an error to be caught by the catch block
                throw new Error(`No curriculum data found for ${gradeName} - ${input.subject}`);
            }
        }
    } catch (error: any) {
        // THE SAFETY NET: If ANYTHING goes wrong, use the fallback instructions.
        console.warn('Using fallback knowledge base due to:', error.message);
        knowledgeBase = `
            OFFICIAL CURRICULUM NOT FOUND. 
            INSTRUCTION: Answer the student's question using your general knowledge about ${input.subject}. 
            DISCLAIMER: You must mention that this is general advice and not from the official syllabus.
        `;
    }
    
    // The flow always proceeds, passing the resolved knowledgeBase to the AI.
    const flowInput = { 
        ...input, 
        knowledgeBase,
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

    

    