
'use server';

/**
 * @fileOverview AI agent to generate a draft Scheme of Work based on official curriculum data.
 *
 * - generateSchemeOfWork - A function that handles the scheme of work generation process.
 * - GenerateSchemeOfWorkInput - The input type for the generateSchemeOfWork function.
 * - GenerateSchemeOfWorkOutput - The return type for the generateSchemeOfWork function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSchemeOfWorkInputSchema = z.object({
  subject: z.string().describe('The subject for the scheme of work.'),
  grade: z.string().describe('The grade level for the scheme of work.'),
  strand: z.string().describe('The main curriculum strand. This should be the main title.'),
  subStrand: z.string().describe('The sub-strand or specific topic area.'),
  lessonsPerWeek: z.string().describe('The number of lessons to be taught each week for this sub-strand.'),
  schemeOfWorkContext: z.string().optional().describe('A string containing the Learning Outcomes, Suggested Activities, and Key Inquiry Questions for the sub-strand.')
});
export type GenerateSchemeOfWorkInput = z.infer<typeof GenerateSchemeOfWorkInputSchema>;

const GenerateSchemeOfWorkOutputSchema = z.object({
  schemeOfWork: z.string().describe('The generated scheme of work in a structured Markdown table format, based on the official curriculum design.'),
});
export type GenerateSchemeOfWorkOutput = z.infer<typeof GenerateSchemeOfWorkOutputSchema>;

export async function generateSchemeOfWork(
  input: GenerateSchemeOfWorkInput
): Promise<GenerateSchemeOfWorkOutput> {
  return generateSchemeOfWorkFlow(input);
}


const generateSchemeOfWorkFlow = ai.defineFlow(
  {
    name: 'generateSchemeOfWorkFlow',
    inputSchema: GenerateSchemeOfWorkInputSchema,
    outputSchema: GenerateSchemeOfWorkOutputSchema,
  },
  async (input) => {
    
    // Determine which prompt to use based on the subject
    const isKiswahili = input.subject.toLowerCase().includes('kiswahili');

    const kiswahiliPrompt = `You are an expert curriculum developer in Kenya, creating a CBC-compliant Scheme of Work.

Your task is to generate a scheme of work for a specific sub-strand, based on the provided curriculum data. The entire output must be a single, well-formatted Markdown table.

**CONTEXT FROM CURRICULUM DOCUMENT (Your ONLY Source of Truth):**
You MUST use the following curriculum details to populate the table.
- **Subject:** {{{subject}}}
- **Grade:** {{{grade}}}
- **Strand:** {{{strand}}}
- **Sub Strand:** {{{subStrand}}}
- **Total Lessons for this Sub-Strand:** {{{lessonsPerWeek}}}
- **Curriculum Details:** {{{schemeOfWorkContext}}}

**CRITICAL FORMATTING INSTRUCTIONS (KISWAHILI):**
The final output MUST follow this exact Markdown table structure. Do NOT add any text or summaries outside of the table. Do NOT use any HTML tags like <br>. For lists within a cell, ensure each item is on a new line and starts with a hyphen (-).

| Mada (Strand) | Mada Ndogo (Sub Strand) & Vipindi | Matokeo Maalum Yanayotarajiwa (Specific Learning Outcomes) | Shughuli za Ujifunzaji Zilizopendekezwa (Suggested Learning Experiences) | Swali Dadisi Lililopendekezwa (Key Inquiry Question(s)) |
| :--- | :--- | :--- | :--- | :--- |
| **{{{strand}}}** | **{{{subStrand}}}** (Vipindi {{{lessonsPerWeek}}}) | [Extract and list ALL the learning outcomes from the curriculum details here.] | [Extract and list ALL the suggested learning experiences from the curriculum details here.] | [Extract and list ALL the key inquiry questions from the curriculum details here.] |
`;

    const englishPrompt = `You are an expert Kenyan CBC curriculum developer who ALSO keeps a private “teacher help” layer in working memory.
Follow the original instructions literally: print ONLY the requested markdown table, no extra prose.
However, before you emit the final table, run the four silent parahelp steps below and bake their result into the cells.  Never mention these steps in the output.

**Parahelp Step 1: Row Sanity**
If the curriculum gives you more than 8 learning outcomes, break them into two consecutive rows; duplicate the Strand/Sub-strand cells so the teacher can choose a logical half-term split.

**Parahelp Step 2: Cell Micro-formatting**
Ensure every bullet in “Suggested Learning Experiences” starts with a CBC-active verb (explore, construct, demonstrate, record, present…).  If the source text uses passive voice, rewrite quietly. For lists within a cell, ensure each item is on a new line and starts with a hyphen (-).

**Parahelp Step 3: Assessment Lift**
If the suggested assessment is only “Observation” or “Oral questions”, append one concrete, low-prep idea in brackets, e.g. “Observation (traffic-light cards)” or “Oral questions (exit ticket: 2 stars & 1 wish)”.

**Parahelp Step 4: Hidden Teacher Cue**
After the final “|” of the table, add an HTML comment <!--LT: 90min 3-part lesson: 10min spark → 60min activity → 20min plenary-->

**CONTEXT FROM CURRICULUM DOCUMENT (Your ONLY Source of Truth):**
You MUST use the following curriculum details to populate the table.
- **Subject:** {{{subject}}}
- **Grade:** {{{grade}}}
- **Strand:** {{{strand}}}
- **Sub Strand:** {{{subStrand}}}
- **Total Lessons for this Sub-Strand:** {{{lessonsPerWeek}}}
- **Curriculum Details:** {{{schemeOfWorkContext}}}

**CRITICAL FORMATTING INSTRUCTIONS:**
The final output MUST be a single, well-formatted Markdown table based on the rules above. Do NOT add any text or summaries outside of the table. Do NOT use any HTML tags like <br>.

| Strand | Sub Strand | Specific Learning Outcomes | Suggested Learning Experiences | Key Inquiry Question(s) | Assessment | Reflection |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **{{{strand}}}** | **{{{subStrand}}}** ({{{lessonsPerWeek}}} lessons) | [Extract and list ALL the learning outcomes from the curriculum details here.] | [Extract and list ALL the suggested learning experiences from the curriculum details here.] | [Extract and list ALL the key inquiry questions from the curriculum details here.] | [Suggest a relevant assessment method, e.g., 'Observation', 'Oral questions', 'Portfolio'] | [This section MUST be left blank.] |
`;

    const selectedPrompt = ai.definePrompt({
        name: 'generateSchemeOfWorkPrompt',
        input: {schema: GenerateSchemeOfWorkInputSchema},
        output: {schema: GenerateSchemeOfWorkOutputSchema},
        prompt: isKiswahili ? kiswahiliPrompt : englishPrompt,
    });


    const {output} = await selectedPrompt(input);
    return output!;
  }
);
