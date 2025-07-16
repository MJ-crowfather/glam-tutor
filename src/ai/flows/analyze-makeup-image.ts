'use server';

/**
 * @fileOverview AI flow for analyzing a user's makeup image to determine face shape,
 * skin tone, current makeup, eye color, and lip shape, and generate personalized
 * makeup routine recommendations.
 *
 * - analyzeMakeupImage - A function that handles the makeup image analysis process.
 * - AnalyzeMakeupImageInput - The input type for the analyzeMakeupImage function.
 * - AnalyzeMakeupImageOutput - The return type for the analyzeMakeupImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMakeupImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeMakeupImageInput = z.infer<typeof AnalyzeMakeupImageInputSchema>;

const AnalyzeMakeupImageOutputSchema = z.object({
  faceShape: z.string().describe('The shape of the face in the image.'),
  skinTone: z.string().describe('The skin tone of the face in the image.'),
  currentMakeup: z
    .string()
    .describe('A description of the makeup currently on the face in the image.'),
  eyeColor: z.string().describe('The eye color of the person in the image.'),
  lipShape: z.string().describe('The shape of the lips in the image.'),
  recommendations: z
    .string()
    .describe('Personalized makeup routine recommendations based on the analysis.'),
});
export type AnalyzeMakeupImageOutput = z.infer<typeof AnalyzeMakeupImageOutputSchema>;

export async function analyzeMakeupImage(
  input: AnalyzeMakeupImageInput
): Promise<AnalyzeMakeupImageOutput> {
  return analyzeMakeupImageFlow(input);
}

const analyzeMakeupImagePrompt = ai.definePrompt({
  name: 'analyzeMakeupImagePrompt',
  input: {schema: AnalyzeMakeupImageInputSchema},
  output: {schema: AnalyzeMakeupImageOutputSchema},
  prompt: `You are a professional makeup artist. Analyze the provided image of a face to determine the face shape, skin tone, current makeup, eye color, and lip shape. Based on this analysis, provide personalized makeup routine recommendations.

Image: {{media url=photoDataUri}}`,
});

const analyzeMakeupImageFlow = ai.defineFlow(
  {
    name: 'analyzeMakeupImageFlow',
    inputSchema: AnalyzeMakeupImageInputSchema,
    outputSchema: AnalyzeMakeupImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeMakeupImagePrompt(input);
    return output!;
  }
);
