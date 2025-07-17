'use server';

import { analyzeProduct } from '@/ai/flows/analyze-product-flow';

// Re-export types for client-side usage
export type { AnalyzeProductOutput } from '@/ai/flows/analyze-product-flow';

// Server action for analyzing a product image
export async function analyzeProductAction(photoDataUri: string) {
  try {
    const result = await analyzeProduct({ photoDataUri });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in analyzeProductAction:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}
