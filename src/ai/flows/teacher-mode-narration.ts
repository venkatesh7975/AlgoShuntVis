'use server';

/**
 * @fileOverview A flow that provides a teacher-like narration for the Shunting Yard algorithm visualization.
 *
 * - teacherModeNarration - A function that generates a narration for the current step of the algorithm.
 * - TeacherModeNarrationInput - The input type for the teacherModeNarration function.
 * - TeacherModeNarrationOutput - The return type for the teacherModeNarration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TeacherModeNarrationInputSchema = z.object({
  token: z.string().describe('The current token being processed.'),
  stack: z.array(z.string()).describe('The current state of the operator stack.'),
  outputQueue: z.array(z.string()).describe('The current state of the output queue.'),
  explanationSoFar: z.string().describe('Explanation built up so far'),
  stepDescription: z.string().describe('The description of the current step of the algorithm.'),
});
export type TeacherModeNarrationInput = z.infer<typeof TeacherModeNarrationInputSchema>;

const TeacherModeNarrationOutputSchema = z.object({
  narration: z.string().describe('The teacher-like narration for the current step.'),
});
export type TeacherModeNarrationOutput = z.infer<typeof TeacherModeNarrationOutputSchema>;

export async function teacherModeNarration(input: TeacherModeNarrationInput): Promise<TeacherModeNarrationOutput> {
  return teacherModeNarrationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'teacherModeNarrationPrompt',
  input: {schema: TeacherModeNarrationInputSchema},
  output: {schema: TeacherModeNarrationOutputSchema},
  prompt: `You are an experienced teacher explaining the Shunting Yard algorithm to students.
  Given the current state of the algorithm, provide a concise and easy-to-understand narration that explains what is happening and why.
  Focus on making the explanation engaging and helpful for students who are learning the algorithm.
  The narration should be no more than two sentences.

  Current Step Description: {{{stepDescription}}}
  Current Token: {{{token}}}
  Operator Stack: {{{stack}}}
  Output Queue: {{{outputQueue}}}
  Explanation so far: {{{explanationSoFar}}}

  Narration:`, 
});

const teacherModeNarrationFlow = ai.defineFlow(
  {
    name: 'teacherModeNarrationFlow',
    inputSchema: TeacherModeNarrationInputSchema,
    outputSchema: TeacherModeNarrationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
