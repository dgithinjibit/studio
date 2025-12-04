import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {vertexAI} from '@genkit-ai/googleai/vertexai';

export const ai = genkit({
  plugins: [
    googleAI(),
    vertexAI(),
  ],
  model: 'vertexai/gemini-1.5-flash-preview-0514',
});
