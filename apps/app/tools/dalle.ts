import type { TToolArg } from '@/types';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { DallEAPIWrapper } from '@langchain/openai';
import { z } from 'zod';

const dalleTool = (args: TToolArg) => {
  const { apiKeys, sendToolResponse } = args;
  const imageGenerationSchema = z.object({
    imageDescription: z.string(),
  });
  return new DynamicStructuredTool({
    name: 'image_generation',
    description: 'Useful for when you asked for image based on description.',
    schema: imageGenerationSchema,
    func: async ({ imageDescription }, runManager) => {
      try {
        const tool = new DallEAPIWrapper({
          n: 1, // Default
          model: 'dall-e-3', // Default
          apiKey: apiKeys.openai, // Default
        });
        const result = await tool.invoke(imageDescription);
        if (!result) {
          runManager?.handleToolError('Error performing Duckduck go search');
          throw new Error('Invalid response');
        }
        sendToolResponse({
          toolName: 'image_generation',
          toolArgs: {
            imageDescription,
          },
          toolRenderArgs: {
            image: result,
          },
          toolResponse: result,
          toolLoading: false,
        });
        const searchPrompt = '';
        return searchPrompt;
      } catch (error) {
        return 'Error performing search. Must not use duckduckgo_search tool now. Ask user to check API keys.';
      }
    },
  });
};
export { dalleTool };
