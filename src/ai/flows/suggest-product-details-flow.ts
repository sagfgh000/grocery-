
'use server';
/**
 * @fileOverview A flow to suggest details for a product based on its name.
 *
 * - suggestProductDetails - A function that returns suggestions for product details.
 * - SuggestProductDetailsInput - The input type for the suggestProductDetails function.
 * - SuggestProductDetailsOutput - The return type for the suggestProductDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductDetailsInputSchema = z.object({
  productName: z.string().describe('The English name of the product.'),
});
export type SuggestProductDetailsInput = z.infer<typeof SuggestProductDetailsInputSchema>;

const SuggestProductDetailsOutputSchema = z.object({
  name_bn: z.string().describe('The suggested Bengali name for the product.'),
  sku: z.string().describe('A suggested SKU for the product, following a logical format (e.g., CTG-PRD-01).'),
  category: z.string().describe('The suggested category for the product.'),
});
export type SuggestProductDetailsOutput = z.infer<typeof SuggestProductDetailsOutputSchema>;

export async function suggestProductDetails(input: SuggestProductDetailsInput): Promise<SuggestProductDetailsOutput> {
  return suggestProductDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductDetailsPrompt',
  input: {schema: SuggestProductDetailsInputSchema},
  output: {schema: SuggestProductDetailsOutputSchema},
  prompt: `You are an expert in grocery store inventory management. Your task is to provide detailed suggestions for a new product based on its English name.

You need to suggest the following:
1.  A Bengali translation for the product name.
2.  A short, logical SKU (Stock Keeping Unit). The format should be 3 letters for the category, 3 letters for the product, and a number. For example, for "Fresh Apples", the category could be "Fruits" (FRT) and the product "Apples" (APL), so the SKU could be "FRT-APL-01".
3.  A relevant product category.

Here is the product name: "{{productName}}".
`,
});

const suggestProductDetailsFlow = ai.defineFlow(
  {
    name: 'suggestProductDetailsFlow',
    inputSchema: SuggestProductDetailsInputSchema,
    outputSchema: SuggestProductDetailsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
