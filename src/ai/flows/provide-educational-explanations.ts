'use server';
/**
 * @fileOverview Provides educational explanations related to makeup products, techniques, or routine steps.
 *
 * - provideEducationalExplanations - A function that provides contextual explanations.
 * - EducationalExplanationsInput - The input type for the provideEducationalExplanations function.
 * - EducationalExplanationsOutput - The return type for the provideEducationalExplanations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EducationalExplanationsInputSchema = z.object({
  topic: z
    .string()
    .describe(
      'The topic for which an explanation is needed (e.g., product name, technique, routine step).'
    ),
  context: z
    .string()
    .optional()
    .describe('Additional context or user question related to the topic.'),
});
export type EducationalExplanationsInput = z.infer<
  typeof EducationalExplanationsInputSchema
>;

const EducationalExplanationsOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A detailed explanation of the topic, including ingredient information, brand background, technique definitions, and tutorial suggestions.'
    ),
});
export type EducationalExplanationsOutput = z.infer<
  typeof EducationalExplanationsOutputSchema
>;

export async function provideEducationalExplanations(
  input: EducationalExplanationsInput
): Promise<EducationalExplanationsOutput> {
  return provideEducationalExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'educationalExplanationsPrompt',
  input: {schema: EducationalExplanationsInputSchema},
  output: {schema: EducationalExplanationsOutputSchema},
  prompt: `You are a helpful assistant that provides educational explanations about makeup.

  Topic: {{{topic}}}
  Context: {{{context}}}

  Provide a detailed explanation of the topic, including ingredient information, brand background, technique definitions, and tutorial suggestions when relevant.
  Make sure to include the most important and relevant information to the user's needs, to help the user make informed choices.
  `,
});

const provideEducationalExplanationsFlow = ai.defineFlow(
  {
    name: 'provideEducationalExplanationsFlow',
    inputSchema: EducationalExplanationsInputSchema,
    outputSchema: EducationalExplanationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
