
'use server';

/**
 * @fileOverview AI agent to generate a draft lesson plan from a prompt, optionally using a Scheme of Work as context.
 *
 * - generateLessonPlan - A function that handles the lesson plan generation process.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  subject: z.string().describe('The subject of the lesson plan.'),
  topic: z.string().describe('The specific topic of the lesson plan.'),
  gradeLevel: z.string().describe('The grade level for the lesson plan.'),
  learningObjectives: z
    .string()
    .describe('The learning objectives for the lesson plan.'),
  strand: z.string().optional().describe('The main curriculum strand.'),
  subStrand: z.string().optional().describe('The curriculum sub-strand.'),
  teacherName: z.string().optional().describe("The teacher's name."),
  school: z.string().optional().describe('The name of the school.'),
  term: z.string().optional().describe('The school term.'),
  year: z.string().optional().describe('The academic year.'),
  roll: z
    .string()
    .optional()
    .describe('The number of students (e.g., "Boys: 20, Girls: 20").'),
  schemeOfWorkContext: z
    .string()
    .optional()
    .describe('The full Markdown content of the relevant Scheme of Work for context.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const GenerateLessonPlanOutputSchema = z.object({
  lessonPlan: z.string().describe('The generated lesson plan in Markdown format.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(
  input: GenerateLessonPlanInput,
  onUpdate: (chunk: string) => void
): Promise<void> {
  const stream = await generateLessonPlanFlow(input);
  for await (const chunk of stream) {
    onUpdate(chunk);
  }
}

const prompt = ai.definePrompt({
  name: 'generateLessonPlanPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an expert curriculum developer in Kenya, creating a detailed, CBC-compliant lesson plan.

{{#if schemeOfWorkContext}}
---
**CONTEXT: SCHEME OF WORK**
You MUST use the following Scheme of Work as the primary source of truth for creating the lesson plan. The lesson plan should be for one specific lesson outlined within this scheme. Extract all necessary details from the scheme.
{{{schemeOfWorkContext}}}
---
**Instruction:** Based on the scheme, select one lesson and create a detailed lesson plan for it.
{{else}}
**Instruction:** Generate a standard lesson plan based on the core details provided by the user.
{{/if}}

**FORMATTING INSTRUCTIONS:**
Generate the lesson plan in Markdown. The structure MUST be as follows:

## Administrative Details
| | | | |
| :--- | :--- | :--- | :--- |
| **School** | {{school}} | **Date** | {{current_date format="DD/MM/YYYY"}} |
| **Learning Area** | {{subject}} | **Time** | 8.00-8.40 am |
| **Year** | {{year}} | **Grade** | {{gradeLevel}} |
| **Term** | {{term}} | **Roll** | {{roll}} |
| **Teacher's Name** | {{teacherName}} | **TSC No.** | |

---

## Lesson Details

**Strand:** {{strand}}
**Sub Strand:** {{subStrand}}

**Lesson Learning outcomes:**
By the end of the lesson the learner should be able to:
{{#if schemeOfWorkContext}}
- **Knowledge:** [Analyze the learning outcomes from the scheme and write the knowledge-based outcome here. Example: Identify different types of lines.]
- **Skill:** [Analyze the learning outcomes from the scheme and write the skill-based outcome here. Example: Model straight lines using sticks, plasticine or clay.]
- **Attitude:** [Analyze the learning outcomes from the scheme and write the attitude-based outcome here. Example: Appreciate the roles of straight lines in the environment.]
{{else}}
{{{learningObjectives}}}
{{/if}}

**Key Inquiry Question(s):**
- [Generate 1-2 relevant inquiry questions based on the topic]

---

## Learning Resources
- [List relevant learning resources based on the topic and activities]

---

## Organization of Learning

### Introduction (5 Minutes)
- [Detail an engaging introduction. How will you link to the previous lesson? What is the hook?]

### Lesson Development (25 Minutes)
**Step 1: [Activity Title] (10 mins)**
- [Describe the first activity. What will the teacher do? What will the learner do? How does it align with the learning objectives? Be specific and learner-centered.]

**Step 2: [Activity Title] (10 mins)**
- [Describe the second activity. Focus on learner-centered participation, collaboration, or a hands-on task.]

**Step 3: [Activity Title] (5 mins)**
- [Describe the third activity, possibly a group discussion, quick presentation, or review.]

### Conclusion (5 Minutes)
- [How will you summarize the key points and assess understanding? What is the key takeaway for the learner?]

---

## Assessment
- [Describe the specific assessment method to be used (e.g., Observation, Checklist, Oral questions, Peer-assessment).]

---

## Teacher's Reflection
- [Leave this section blank for the teacher to fill in after the lesson.]
`,
});


const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { stream } = await ai.generate({
      prompt: prompt.prompt,
      model: ai.getModel(),
      input: input,
      stream: true,
      output: {
        format: 'text',
      }
    });

    // This is a streaming helper. It aggregates the chunks and returns the final result.
    let finalResult = "";
    for await (const chunk of stream) {
      finalResult += chunk.output?.text || "";
    }
    
    //This is a workaround for a bug in the Genkit streaming implementation
    // The finalResult is what is actually streamed to the client, but we need to resolve the flow's promise.
    const {output} = await prompt(input);
    return output!.lessonPlan;
  }
);
