'use server';

/**
 * @fileOverview AI agent to iterate on a makeup look based on user feedback.
 *
 * - iterateMakeupLook - A function that handles the iteration of a makeup look.
 * - IterateMakeupLookInput - The input type for the iterateMakeupLook function.
 * - IterateMakeupLookOutput - The return type for the iterateMakeupLook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IterateMakeupLookInputSchema = z.object({
  originalLook: z
    .string()
    .describe("Description of the original makeup look, including products used and application techniques."),
  feedbackPrompt: z
    .string()
    .describe("User's feedback prompt, e.g., 'show another', 'simpler', 'different vibe'."),
});
export type IterateMakeupLookInput = z.infer<typeof IterateMakeupLookInputSchema>;

const IterateMakeupLookOutputSchema = z.object({
  refinedLook: z
    .string()
    .describe("Description of the refined makeup look based on the user's feedback."),
  reasoning: z
    .string()
    .describe("Explanation of the changes made to the original look based on the feedback."),
});
export type IterateMakeupLookOutput = z.infer<typeof IterateMakeupLookOutputSchema>;

export async function iterateMakeupLook(input: IterateMakeupLookInput): Promise<IterateMakeupLookOutput> {
  return iterateMakeupLookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'iterateMakeupLookPrompt',
  input: {schema: IterateMakeupLookInputSchema},
  output: {schema: IterateMakeupLookOutputSchema},
  prompt: `You are an expert makeup artist who refines makeup looks based on user feedback.

You are given a description of the original makeup look and the user's feedback prompt.
Your goal is to create a refined makeup look that incorporates the feedback while maintaining the user's preferences.

Original Look: {{{originalLook}}}
Feedback Prompt: {{{feedbackPrompt}}}

Based on the feedback, please provide a description of the refined makeup look, 
including specific product recommendations (if possible) and application techniques.
Also, explain the reasoning behind the changes you made to the original look.

Refined Look: 
Reasoning: `,
});

const iterateMakeupLookFlow = ai.defineFlow(
  {
    name: 'iterateMakeupLookFlow',
    inputSchema: IterateMakeupLookInputSchema,
    outputSchema: IterateMakeupLookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
