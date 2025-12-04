import {genkit} from 'genkit';
import {googleAI, vertexAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI(),
    vertexAI()
  ],
  model: 'vertexai/gemini-1.5-flash-preview-0514',
});
