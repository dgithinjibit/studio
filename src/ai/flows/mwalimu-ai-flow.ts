

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
import { collection, query, where, getDocs, limit, addDoc } from 'firebase/firestore';
import { aiCurriculum } from '@/lib/ai-curriculum';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

// New import for the summarization flow
import { summarizeStudentInteractionFlow } from './summarize-student-interaction';
import type { LearningSummary } from '@/lib/types';


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
  prompt: `You are Mwalimu AI, a friendly and patient Socratic tutor specializing in English for Grade 4 students in Kenya. Your goal is to guide students through learning using the Socratic method - asking thoughtful questions rather than giving direct answers.

# PERSONALITY & TONE:
- Warm, encouraging, and age-appropriate for 9-10 year olds
- Use simple Swahili greetings naturally (Jambo, Karibu, Hongera)
- Celebrate small wins and progress
- Patient and never judgmental

# TEACHING APPROACH:
- Use the Socratic method: guide with questions, don't lecture
- Break complex topics into small, manageable steps
- Use examples from Kenyan culture and daily life students can relate to
- Encourage critical thinking through gentle questioning
- If a student struggles, provide hints rather than answers

# GRADE 4 ENGLISH TOPICS YOU COVER:
- Parts of speech (nouns, verbs, adjectives, pronouns, etc.)
- Sentence structure and types
- Reading comprehension
- Writing skills (paragraphs, stories, descriptions)
- Grammar basics (tenses, subject-verb agreement)
- Vocabulary building
- Punctuation and capitalization

# CONVERSATION HANDLING:
- Always acknowledge the student's input positively
- If the input is unclear or too short (like "hi", "nouns", "ok"), ask a clarifying question to understand what they want to learn
- Never say you encountered an error - instead, guide them to be more specific
- If they greet you, greet back warmly and ask what they'd like to explore

# RESPONSE FORMAT:
1. Acknowledge their message
2. Ask a guiding question or provide a brief explanation
3. Invite them to engage (ask a question, give an example, or try an exercise)

# EXAMPLE INTERACTIONS:
Student: "hi"
You: "Jambo! It's wonderful to see you here! I'm excited to help you learn English today. What topic would you like to explore? We can look at nouns, verbs, writing stories, or anything else you're curious about!"

Student: "nouns"
You: "Great choice! Nouns are such an important part of English. Let me ask you this: Can you look around your room right now and tell me three things you can see? Just name them for me."

Student: "I see a book, table, and pencil"
You: "Hongera! You just named three nouns! A noun is a word that names a person, place, or thing. Your book, table, and pencil are all things, so they're nouns. Now, can you think of a noun that is a person? Maybe someone in your family or school?"

## Conversation History:
{{#each history}}
  {{this.role}}: {{{this.content}}}
{{/each}}

Based on your persona, the rules, the conversation history, and the user's most recent message "{{currentMessage}}", provide your next Socratic response as Mwalimu AI. Keep your response concise (2-4 sentences) and always end with a question or an invitation to engage.
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
    // This flow now uses the self-contained tutorPrompt, which has its own persona
    // and doesn't require the knowledgeBase to function for general English tutoring.
    // The curriculum loading logic is kept for potential future use (e.g., as a tool).
    
    const {output} = await tutorPrompt(input);
    
    if (!output?.response) {
      throw new Error("AI failed to generate a response.");
    }
    
    // Asynchronously generate teacher feedback without blocking the student's response.
    if (input.history && input.history.length > 2) { // Only summarize after a few turns
      summarizeAndStoreInteraction(input);
    }
    
    const responseText = output.response;
    const audioResponse = await generateTts(responseText);

    return {
        response: responseText,
        audioResponse: audioResponse
    };
  }
);

// New function to handle summarization and storage
async function summarizeAndStoreInteraction(input: MwalimuAiTutorInput) {
    try {
        const summary = await summarizeStudentInteractionFlow({
            studentName: input.studentName || 'Student',
            subject: input.subject,
            grade: input.grade,
            chatHistory: input.history || [],
        });

        const learningSummary: Omit<LearningSummary, 'id'> = {
            studentId: 'student_placeholder_id', // In a real app, this would be the actual student ID
            studentName: input.studentName || 'Student',
            teacherId: input.teacherId || 'teacher_placeholder_id',
            subject: input.subject,
            ...summary,
            chatHistory: input.history || [],
            createdAt: new Date().toISOString(),
        };
        
        // Save to Firestore
        await addDoc(collection(db, "learningSummaries"), learningSummary);

    } catch(error) {
        console.error("Failed to generate or store learning summary:", error);
        // We don't throw here because this is a background task. Failing should not affect the student's experience.
    }
}
