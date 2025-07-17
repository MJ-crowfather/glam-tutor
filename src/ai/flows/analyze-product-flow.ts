'use server';

/**
 * @fileOverview AI flow for analyzing an image of a product.
 *
 * - analyzeProduct - A function that handles the product analysis process.
 * - AnalyzeProductInput - The input type for the analyzeProduct function.
 * - AnalyzeProductOutput - The return type for the analyzeProduct function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProductInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeProductInput = z.infer<typeof AnalyzeProductInputSchema>;

const AnalyzeProductOutputSchema = z.object({
  productName: z.string().describe('The identified name of the product.'),
  manufacturer: z.string().describe('The name of the company that manufactures the product.'),
  summary: z.string().describe('A brief, neutral summary of what the product is and what it does.'),
  pros: z.array(z.string()).describe('A list of potential positive aspects or benefits of the product.'),
  cons: z.array(z.string()).describe('A list of potential negative aspects or drawbacks of the product.'),
  companyAnalysis: z.string().describe("An analysis of the manufacturing company, including information on public perception, ethical practices (like animal testing, labor practices), or any notable controversies or positive contributions. This should be a balanced overview based on publicly available information."),
});
export type AnalyzeProductOutput = z.infer<typeof AnalyzeProductOutputSchema>;

export async function analyzeProduct(
  input: AnalyzeProductInput
): Promise<AnalyzeProductOutput> {
  return analyzeProductFlow(input);
}

const analyzeProductPrompt = ai.definePrompt({
  name: 'analyzeProductPrompt',
  input: {schema: AnalyzeProductInputSchema},
  output: {schema: AnalyzeProductOutputSchema},
  prompt: `You are an expert product analyst. Your task is to identify the product in the provided image and conduct a thorough analysis.

Based on the image, please provide the following information:
1.  **Product Identification**: What is the full name of the product and who is the manufacturer?
2.  **Summary**: Briefly describe the product's primary function.
3.  **Pros**: List a few key benefits or positive aspects.
4.  **Cons**: List a few key drawbacks or negative aspects.
5.  **Company Analysis**: Provide a comprehensive and neutral analysis of the manufacturing company. Research and include details about their reputation, any known ethical concerns (e.g., animal testing, environmental impact, labor practices), political ties if significant and public, or major positive contributions and initiatives. The goal is to give the user a well-rounded understanding of the company behind the product.

Image: {{media url=photoDataUri}}`,
});

const analyzeProductFlow = ai.defineFlow(
  {
    name: 'analyzeProductFlow',
    inputSchema: AnalyzeProductInputSchema,
    outputSchema: AnalyzeProductOutputSchema,
  },
  async input => {
    const {output} = await analyzeProductPrompt(input);
    return output!;
  }
);
