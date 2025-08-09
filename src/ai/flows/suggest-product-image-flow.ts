
'use server';
/**
 * @fileOverview A flow to suggest an image for a product based on its name.
 *
 * - suggestProductImage - A function that returns a URL for a product image.
 * - SuggestProductImageInput - The input type for the suggestProductImage function.
 * - SuggestProductImageOutput - The return type for the suggestProductImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductImageInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
});
export type SuggestProductImageInput = z.infer<typeof SuggestProductImageInputSchema>;

const SuggestProductImageOutputSchema = z.object({
  imageUrl: z.string().describe('The suggested URL for the product image.'),
});
export type SuggestProductImageOutput = z.infer<typeof SuggestProductImageOutputSchema>;

export async function suggestProductImage(input: SuggestProductImageInput): Promise<SuggestProductImageOutput> {
  return suggestProductImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductImagePrompt',
  input: {schema: SuggestProductImageInputSchema},
  output: {schema: SuggestProductImageOutputSchema},
  prompt: `You are an expert at finding placeholder images. Your task is to provide a placeholder image URL from placehold.co for a given product name.

The image should be 300x300 pixels.
The URL should be in the format: https://placehold.co/300x300.png
Do not add any text to the URL.

For the product name "{{productName}}", provide a suitable image URL.
`,
});

const suggestProductImageFlow = ai.defineFlow(
  {
    name: 'suggestProductImageFlow',
    inputSchema: SuggestProductImageInputSchema,
    outputSchema: SuggestProductImageOutputSchema,
  },
  async (input) => {
    // For a real implementation, you might call an image search API.
    // Here, we'll just use placehold.co with a hint.
    const imageUrl = `https://placehold.co/300x300.png`;
    return { imageUrl };
  }
);
