
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
import { aiCurriculum } from '@/lib/ai-curriculum';
import { blockchainCurriculum } from '@/lib/blockchain-curriculum';

// Grade 1
import { grade1CreCurriculum } from '@/curriculum/grade1-cre';
import { grade1CreativeActivitiesCurriculum } from '@/curriculum/grade1-creative-activities';
import { grade1EnglishLanguageActivitiesCurriculum } from '@/curriculum/grade1-english-language-activities';
import { grade1EnvironmentalActivitiesCurriculum } from '@/curriculum/grade1-environmental-activities';
import { grade1IndigenousLanguageCurriculum } from '@/curriculum/grade1-indigenous-language';
import { grade1KiswahiliLanguageActivitiesCurriculum } from '@/curriculum/grade1-kiswahili-language-activities';
import { grade1MathematicsActivitiesCurriculum } from '@/curriculum/grade1-mathematics-activities';

// Grade 2
import { grade2CreCurriculum } from '@/curriculum/grade2-cre';
import { grade2CreativeActivitiesCurriculum } from '@/curriculum/grade2-creative-activities';
import { grade2EnglishLanguageActivitiesCurriculum } from '@/curriculum/grade2-english-language-activities';
import { grade2EnvironmentalActivitiesCurriculum } from '@/curriculum/grade2-environmental-activities';
import { grade2IndigenousLanguageCurriculum } from '@/curriculum/grade2-indigenous-language';
import { grade2KiswahiliLanguageActivitiesCurriculum } from '@/curriculum/grade2-kiswahili-language-activities';
import { grade2MathematicsActivitiesCurriculum } from '@/curriculum/grade2-mathematics-activities';

// Grade 3
import { grade3CreCurriculum } from '@/curriculum/grade3-cre';
import { grade3CreativeActivitiesCurriculum } from '@/curriculum/grade3-creative-activities';
import { grade3EnglishLanguageActivitiesCurriculum } from '@/curriculum/grade3-english-language-activities';
import { grade3EnvironmentalActivitiesCurriculum } from '@/curriculum/grade3-environmental-activities';
import { grade3IndigenousLanguageCurriculum } from '@/curriculum/grade3-indigenous-language';
import { grade3KiswahiliLanguageActivitiesCurriculum } from '@/curriculum/grade3-kiswahili-language-activities';
import { grade3MathematicsActivitiesCurriculum } from '@/curriculum/grade3-mathematics-activities';

// Grade 4
import { grade4AgricultureAndNutritionCurriculum } from '@/curriculum/grade4-agriculture-and-nutrition';
import { grade4CreCurriculum } from '@/curriculum/grade4-cre';
import { grade4CreativeArtsCurriculum } from '@/curriculum/grade4-creative-arts';
import { grade4EnglishLanguageActivitiesCurriculum } from '@/curriculum/grade4-english-language-activities';
import { grade4IndigenousLanguageCurriculum } from '@/curriculum/grade4-indigenous-language';
import { grade4KiswahiliLanguageActivitiesCurriculum } from '@/curriculum/grade4-kiswahili-language-activities';
import { grade4ReligiousEducationCurriculum } from '@/curriculum/grade4-religious-education';
import { grade6SocialStudiesCurriculum } from '@/curriculum/grade6-social-studies';


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

## SCENARIO 2: AI & Blockchain Curriculum Tutor (Subject: "AI" or "Blockchain")

**Your Persona:** You are a specialized AI & Blockchain curriculum tutor. Your goal is to guide the learner through the provided syllabus, from foundational concepts to advanced projects.

**Your Capabilities:**
1.  **Syllabus Navigation:** Answer questions about the curriculum's vision, guiding principles, and different learning stages (Early Years, Middle School, etc.).
2.  **Concept Explanation:** Explain concepts from the curriculum, like "computational thinking," "algorithms," "machine learning," or "decentralized ledger" using the examples and activities provided in the text.
3.  **Project Guidance:** Act as a project coach for the activities listed in the syllabus (e.g., "Community Helper Chatbot," "M-Pesa Fraud Predictor"). Help learners understand the project goals, tools, and underlying concepts.
4.  **Ethical Discussion:** Facilitate discussions on ethics, using the case studies and debate topics mentioned in the curriculum (e.g., algorithmic bias, data privacy, digital voting).

**Your Knowledge Source:**
You MUST base all your answers on the provided curriculum in the "Context from Teacher's Materials." Do not introduce topics or projects not mentioned in the syllabus.

---

## SCENARIO 3: Socratic Mentor (All Other Subjects, including Kiswahili)

**Your Persona:** You are a patient, curious, and insightful Socratic mentor. Your purpose is to foster critical thinking and self-discovery.

**Your Core Philosophy:**
- **Language Immersion:** If the subject is 'Kiswahili', your entire conversation MUST be in fluent, grammatically correct Swahili. Do not use English.
- **Question, Don't Tell:** Your primary tool is the question. Respond with a thoughtful question that guides the learner.
- **"Two-Try" Rule:** Allow the learner two attempts. If they are still stuck, provide the concept clearly, then pivot back to inquiry.
- **Growth-Paced & Creative:** Adapt to the learner's pace and generate project ideas that connect subjects.
- **Grounding Rule:** If the 'Teacher Context' is available, you MUST base all your Socratic questions, explanations, and answers on it. If a student's question cannot be answered using ONLY the provided context, you must respond with: "That's an interesting question! It seems to be outside the materials for this topic. Shall we explore something from the curriculum?" Do not attempt to answer it using external knowledge.

### Foundational Learner Support Strategies (Your Coaching Toolkit):
To improve a student's well-being and help them succeed, you can use the following strategies, which address the need for immediate feedback and structured support:

**Break Down Tasks and Integrate Breaks:** Instead of expecting the student to work on an assignment from start to finish, break the work into smaller, more manageable chunks. The student can then earn a short break after completing each chunk. Tools like a timer can be used to set a specific work duration, after which a break is taken. This approach helps sustain focus and provides more frequent, tangible rewards. It can also be beneficial to involve the student in deciding how the work is broken up, which helps them learn to manage their time more effectively.

**Optimize the Learning Environment:** Ensure the student's workspace is conducive to focus. This involves checking a few key factors before they begin:
- **Time:** Make sure the student has enough time to complete the task without being interrupted.
- **Place:** Help them find a location where they are less likely to get distracted.
- **Instructions:** Confirm that they have clear instructions for the assignment and know where to find them.
- **Supplies:** Check that they have all the necessary supplies or devices before they start.

**Address Emotional Barriers:** A major hurdle for students can be the fear of doing the work incorrectly. It is crucial to help the student understand that it is always better to start the work, even imperfectly, than to never begin at all. Helping them identify the very first, most simple step can make the task feel less daunting and help overcome this initial block.

**Your Knowledge Source:**
Base your Socratic questions and answers on the "Context from Teacher's Materials" if it's available. If the context is empty, state that the teacher has not provided specific materials for this topic and you can discuss it generally.

---

## Session Details

**Subject:** {{subject}}
**Grade:** {{grade}}

{{#if teacherContext}}
### Context from Teacher's Materials (Your ONLY Knowledge Source):
---
{{{teacherContext}}}
---
{{/if}}

## Conversation History:
{{#each history}}
  {{this.role}}: {{{this.content}}}
{{/each}}

Based on the subject, conversation history, and your instructions for the relevant persona, provide your next response as Mwalimu AI.
`,
});

const getCurriculumForSubject = (grade: string, subject: string) => {
    const sanitizedSubject = subject.replace(/\s+/g, '');

    const gradeCurricula: { [key: string]: any } = {
        g1: {
            ChristianReligiousEducation: grade1CreCurriculum,
            CreativeActivities: grade1CreativeActivitiesCurriculum,
            EnglishLanguageActivities: grade1EnglishLanguageActivitiesCurriculum,
            EnvironmentalActivities: grade1EnvironmentalActivitiesCurriculum,
            IndigenousLanguageActivities: grade1IndigenousLanguageCurriculum,
            KiswahiliLanguageActivities: grade1KiswahiliLanguageActivitiesCurriculum,
            MathematicalActivities: grade1MathematicsActivitiesCurriculum,
        },
        g2: {
            ChristianReligiousEducation: grade2CreCurriculum,
            CreativeActivities: grade2CreativeActivitiesCurriculum,
            EnglishLanguageActivities: grade2EnglishLanguageActivitiesCurriculum,
            EnvironmentalActivities: grade2EnvironmentalActivitiesCurriculum,
            IndigenousLanguageActivities: grade2IndigenousLanguageCurriculum,
            KiswahiliLanguageActivities: grade2KiswahiliLanguageActivitiesCurriculum,
            MathematicalActivities: grade2MathematicsActivitiesCurriculum,
        },
        g3: {
            ChristianReligiousEducation: grade3CreCurriculum,
            CreativeActivities: grade3CreativeActivitiesCurriculum,
            EnglishLanguageActivities: grade3EnglishLanguageActivitiesCurriculum,
            EnvironmentalActivities: grade3EnvironmentalActivitiesCurriculum,
            IndigenousLanguageActivities: grade3IndigenousLanguageCurriculum,
            KiswahiliLanguageActivities: grade3KiswahiliLanguageActivitiesCurriculum,
            MathematicalActivities: grade3MathematicsActivitiesCurriculum,
        },
        g4: {
            AgricultureandNutrition: grade4AgricultureAndNutritionCurriculum,
            ReligiousEducation: grade4ReligiousEducationCurriculum,
            CreativeArts: grade4CreativeArtsCurriculum,
            English: grade4EnglishLanguageActivitiesCurriculum,
            IndigenousLanguages: grade4IndigenousLanguageCurriculum,
            Kiswahili: grade4KiswahiliLanguageActivitiesCurriculum,
            SocialStudies: grade6SocialStudiesCurriculum, // Using Grade 6 as placeholder
        },
        g5: { // Assuming G5 uses G4 curriculum for this prototype
            AgricultureandNutrition: grade4AgricultureAndNutritionCurriculum,
            ReligiousEducation: grade4ReligiousEducationCurriculum,
            CreativeArts: grade4CreativeArtsCurriculum,
            English: grade4EnglishLanguageActivitiesCurriculum,
            IndigenousLanguages: grade4IndigenousLanguageCurriculum,
            Kiswahili: grade4KiswahiliLanguageActivitiesCurriculum,
            SocialStudies: grade6SocialStudiesCurriculum,
        },
        g6: {
            SocialStudies: grade6SocialStudiesCurriculum,
        }
    };

    return gradeCurricula[grade]?.[sanitizedSubject] || null;
}

const mwalimuAiTutorFlow = ai.defineFlow(
  {
    name: 'mwalimuAiTutorFlow',
    inputSchema: MwalimuAiTutorInputSchema,
    outputSchema: MwalimuAiTutorOutputSchema,
  },
  async (input) => {
    // Handle initial greeting separately to ensure a good first experience.
    if (!input.history || input.history.length === 0) {
        const gradeName = `Grade ${input.grade.replace('g', '')}`;
        
        if (input.subject === 'Indigenous Language') {
            return {
                response: "Habari! I'm your Gikuyu Literacy Buddy. You can ask me to translate words, quiz you, or teach you about categories like 'greetings', 'animals', or 'family'. What would you like to do first?"
            };
        }
         if (input.subject.toLowerCase().includes('kiswahili')) {
            return {
                response: `Habari! Mimi ni Mwalimu AI, mshauri wako wa masomo. Nimefurahi kuona umechagua Kiswahili kwa ${gradeName} leo - chaguo bora sana! Ili kuanza safari yetu, ni mada gani au swali gani ungependa tujadili pamoja?`
            };
        }
        if (input.subject === 'AI') {
             if (['g4', 'g5', 'g6'].includes(input.grade)) {
                return {
                    response: `Habari! I'm Mwalimu AI, your personal thinking partner. I see you're ready to explore AI for ${gradeName}.\n\nAccording to the curriculum, a key skill is understanding algorithms. Let's start there: can you describe the 'algorithm' or steps you followed to get ready for school today?`
                };
            }
             if (['g7', 'g8', 'g9'].includes(input.grade)) {
                return {
                    response: `Habari! I'm Mwalimu AI, your personal thinking partner. I see you're ready to explore AI for ${gradeName}.\n\nThe curriculum mentions building a 'Community Helper Chatbot.' Before we get to that, let's think about conversations. What makes a good conversation helper? What should they know?`
                };
            }
        }
        if (input.subject === 'Blockchain') {
             if (['g4', 'g5', 'g6'].includes(input.grade)) {
                return {
                    response: `Habari! I'm Mwalimu AI, your personal thinking partner. I see you're ready to explore Blockchain for ${gradeName}.\n\nAccording to the curriculum, a key concept is a 'digital record' or ledger. Can you think of an example of a digital record you use in your daily life, maybe at home or at school?`
                };
            }
            if (['g7', 'g8', 'g9'].includes(input.grade)) {
                return {
                    response: `Habari! I'm Mwalimu AI, your personal thinking partner. I see you're ready to explore Blockchain for ${gradeName}.\n\nThe curriculum talks about keeping digital information safe. How do you keep your own information private, like a secret note or a password? What makes it secure?`
                };
            }
        }

        // Default greeting
        return {
            response: `Habari! I'm Mwalimu AI, your personal thinking partner. I see we're exploring ${input.subject} for ${gradeName} today - a fantastic choice! To start our journey, what topic or question is on your mind? Let's unravel it together.`
        };
    }
    
    // The history is now passed directly from the UI, no modification needed.
    const flowInput: MwalimuAiTutorInput = { ...input };
    
    if (flowInput.subject === 'AI') {
      flowInput.teacherContext = `AI Curriculum:\n${aiCurriculum}`;
    }
    else if (flowInput.subject === 'Blockchain') {
      flowInput.teacherContext = `Blockchain Curriculum:\n${blockchainCurriculum}`;
    }
    else if (flowInput.subject === 'Indigenous Language' && input.currentMessage) {
      const categories = Object.keys(kikuyuDictionary) as Array<keyof typeof kikuyuDictionary>;
      let foundCategory: keyof typeof kikuyuDictionary | null = null;
      
      // Find which category the user is asking about
      for (const category of categories) {
        // Look for the category name (e.g. 'body_parts' -> 'body parts') in the user's message
        if (input.currentMessage.toLowerCase().includes(category.replace(/_/g, ' '))) {
          foundCategory = category;
          break;
        }
      }

      if (foundCategory) {
        // If a category is found, provide ONLY that category's data.
        const categoryData = kikuyuDictionary[foundCategory];
        flowInput.teacherContext = `The user is asking about the '${foundCategory}' category. Here is the relevant vocabulary:\n${JSON.stringify(categoryData, null, 2)}`;
      } else {
        // If no specific category is mentioned, provide the list of available categories to guide the user.
        flowInput.teacherContext = `The user has not asked for a specific category. Let them know what categories are available to learn from: ${categories.map(c => c.replace(/_/g, ' ')).join(', ')}. Do not list any words yet.`;
      }
    } else {
        // Dynamically load the curriculum data based on grade and subject
        const curriculum = getCurriculumForSubject(input.grade, input.subject);

        if (curriculum) {
            flowInput.teacherContext = `Curriculum for ${input.grade} ${input.subject}:\n${JSON.stringify(curriculum, null, 2)}`;
        }
    }
    
    const {output} = await tutorPrompt(flowInput);
    return output!;
  }
);
