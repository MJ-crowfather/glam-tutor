// This is an AI-powered function that identifies a makeup product from an image and provides information about it.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecognizeMakeupProductInputSchema = z.object({
  productPhotoDataUri: z.string().describe(
    'A photo of the makeup product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
  ),
});
export type RecognizeMakeupProductInput = z.infer<typeof RecognizeMakeupProductInputSchema>;

const ProductInformationSchema = z.object({
  brand: z.string().describe('The brand of the makeup product.'),
  productName: z.string().describe('The name of the makeup product.'),
  useCase: z.string().describe('The primary use case of the makeup product.'),
  usageGuidance: z.string().describe('Instructions on how to use the product effectively.'),
  ingredients: z.string().optional().describe('A list of ingredients in the product, if available.'),
});

const SimilarProductsSchema = z.array(z.string()).describe('Similar product names.');

const RecognizeMakeupProductOutputSchema = z.object({
  productInformation: ProductInformationSchema.describe('Detailed information about the makeup product.'),
  similarProducts: SimilarProductsSchema.describe('A list of similar makeup products.'),
  trustedArticles: z.array(z.string()).describe('Links to trusted articles or reviews about the product.'),
});

export type RecognizeMakeupProductOutput = z.infer<typeof RecognizeMakeupProductOutputSchema>;


export async function recognizeMakeupProduct(input: RecognizeMakeupProductInput): Promise<RecognizeMakeupProductOutput> {
  return recognizeMakeupProductFlow(input);
}

const findSimilarProducts = ai.defineTool({
  name: 'findSimilarProducts',
  description: 'Finds similar makeup products based on brand, type and other information.',
  inputSchema: z.object({
    brand: z.string().describe('The brand of the makeup product.'),
    productName: z.string().describe('The name of the makeup product.'),
    useCase: z.string().describe('The primary use case of the makeup product.'),
  }),
  outputSchema: z.array(z.string()).describe('A list of similar makeup products.'),
}, async (input) => {
  // TODO: Implement the logic to find similar products using an external API or database.
  // This is a placeholder implementation.
  return [
    `Similar product 1 to ${input.productName} from ${input.brand}`, `Similar product 2 to ${input.productName} from ${input.brand}`
  ];
});


const recognizeMakeupProductPrompt = ai.definePrompt({
  name: 'recognizeMakeupProductPrompt',
  tools: [findSimilarProducts],
  input: {schema: RecognizeMakeupProductInputSchema},
  output: {schema: RecognizeMakeupProductOutputSchema},
  prompt: `You are an AI makeup assistant. You will identify a makeup product from an image and provide information about it.

  Analyze the following makeup product and provide details such as brand, product name, use case, and usage guidance. Also, find similar products using the findSimilarProducts tool.

  Product Image: {{media url=productPhotoDataUri}}
  `,
});

const recognizeMakeupProductFlow = ai.defineFlow(
  {
    name: 'recognizeMakeupProductFlow',
    inputSchema: RecognizeMakeupProductInputSchema,
    outputSchema: RecognizeMakeupProductOutputSchema,
  },
  async input => {
    const {output} = await recognizeMakeupProductPrompt(input);
    // @ts-ignore
    return output!;
  }
);
