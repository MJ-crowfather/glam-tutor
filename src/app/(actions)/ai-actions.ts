'use server';

import { analyzeMakeupImage } from '@/ai/flows/analyze-makeup-image';
import { iterateMakeupLook } from '@/ai/flows/iterate-makeup-look';
import { provideEducationalExplanations } from '@/ai/flows/provide-educational-explanations';
import { recognizeMakeupProduct } from '@/ai/flows/recognize-makeup-product';

// Re-export types for client-side usage
export type { AnalyzeMakeupImageOutput } from '@/ai/flows/analyze-makeup-image';
export type { RecognizeMakeupProductOutput } from '@/ai/flows/recognize-makeup-product';
export type { IterateMakeupLookOutput } from '@/ai/flows/iterate-makeup-look';

// Server action for analyzing a face image
export async function analyzeFaceAction(photoDataUri: string) {
  try {
    const result = await analyzeMakeupImage({ photoDataUri });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in analyzeFaceAction:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

// Server action for recognizing a makeup product
export async function recognizeProductAction(productPhotoDataUri: string) {
  try {
    const result = await recognizeMakeupProduct({ productPhotoDataUri });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in recognizeProductAction:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

// Server action for iterating on a makeup look
export async function iterateLookAction(originalLook: string, feedbackPrompt: string) {
  try {
    const result = await iterateMakeupLook({ originalLook, feedbackPrompt });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in iterateLookAction:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

// Server action for getting educational explanations (for the chatbot)
export async function getExplanationAction(topic: string, context?: string) {
  try {
    const result = await provideEducationalExplanations({ topic, context });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getExplanationAction:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}
