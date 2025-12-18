

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
import { collection, addDoc } from 'firebase/firestore';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';
import { getAuth } from 'firebase/auth';

// New import for the summarization flow
import { summarizeStudentInteractionFlow } from './summarize-student-interaction';
import type { LearningSummary } from '@/lib/types';


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


const mwalimuAiTutorFlow = ai.defineFlow(
  {
    name: 'mwalimuAiTutorFlow',
    inputSchema: MwalimuAiTutorInputSchema,
    outputSchema: MwalimuAiTutorOutputSchema,
  },
  async (input) => {
    
    const {output} = await tutorPrompt(input);
    
    if (!output?.response) {
      throw new Error("AI failed to generate a response.");
    }
    
    // Asynchronously generate teacher feedback without blocking the student's response.
    if (input.history && input.history.length > 2 && input.studentId) { 
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
            studentId: input.studentId!,
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
