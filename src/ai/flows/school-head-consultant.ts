
'use server';

/**
 * @fileOverview AI agent to act as an operational consultant for a school head.
 *
 * - schoolHeadConsultant - A function that handles the analysis.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SchoolDataSchema = z.object({
    teacherCount: z.number().describe("Total number of teachers in the school."),
    studentCount: z.number().describe("Total number of students in the school."),
    averageAttendance: z.number().describe("The school-wide average student attendance percentage."),
    classes: z.array(z.object({
        name: z.string().describe("The name of the class."),
        studentCount: z.number().describe("Number of students in the class."),
        averagePerformance: z.number().describe("The average performance score (out of 100) for the class."),
    })).describe("A list of all classes in the school."),
    resources: z.array(z.object({
        title: z.string().describe("The title of the resource."),
        type: z.string().describe("The type of resource (e.g., 'Lesson Plan', 'Textbook', 'Science Kit').")
    })).describe("A list of available educational resources.")
});

export const SchoolHeadConsultantInputSchema = z.object({
  question: z.string().describe("The strategic or operational question from the school head."),
  schoolData: SchoolDataSchema.describe("The operational data for the school."),
});
export type SchoolHeadConsultantInput = z.infer<typeof SchoolHeadConsultantInputSchema>;

export const SchoolHeadConsultantOutputSchema = z.object({
  response: z.string().describe('A data-driven, insightful response to the school head\'s question, acting as an expert educational consultant.'),
});
export type SchoolHeadConsultantOutput = z.infer<typeof SchoolHeadConsultantOutputSchema>;

export async function schoolHeadConsultant(
  input: SchoolHeadConsultantInput
): Promise<SchoolHeadConsultantOutput> {
  return schoolHeadConsultantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'schoolHeadConsultantPrompt',
  input: {schema: SchoolHeadConsultantInputSchema},
  output: {schema: SchoolHeadConsultantOutputSchema},
  prompt: `You are an expert AI Operational Consultant for a Kenyan school headteacher. Your role is to analyze the provided school data to answer their strategic questions. Provide clear, data-driven insights and actionable recommendations.

**School Operational Data:**
---
- **Total Teachers:** {{schoolData.teacherCount}}
- **Total Students:** {{schoolData.studentCount}}
- **Student-Teacher Ratio:** {{eval "schoolData.studentCount / schoolData.teacherCount" orelse=0 format="0.0"}}:1
- **School-Wide Average Attendance:** {{schoolData.averageAttendance}}%

**Class Details:**
{{#each schoolData.classes}}
- **{{name}}:** {{studentCount}} students, {{averagePerformance}}% average performance.
{{/each}}

**Available Resources:**
{{#if schoolData.resources}}
{{#each schoolData.resources}}
- {{title}} (Type: {{type}})
{{/each}}
{{else}}
- No specific resources logged.
{{/if}}
---

**Headteacher's Question:**
"{{{question}}}"

Based *only* on the data provided above, analyze the situation and provide a concise, insightful response. Connect different data points to form your analysis (e.g., connect resource availability to class performance). Start your response with a direct answer, then explain your reasoning based on the data.
`,
});

const schoolHeadConsultantFlow = ai.defineFlow(
  {
    name: 'schoolHeadConsultantFlow',
    inputSchema: SchoolHeadConsultantInputSchema,
    outputSchema: SchoolHeadConsultantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
