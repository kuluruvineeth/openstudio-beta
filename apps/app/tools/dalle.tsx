import { GeneratedImage } from '@/app/(authenticated)/chat/components/generated-image';
import type { ToolDefinition, ToolExecutionContext } from '@/types/tools';
import { AiImageIcon } from '@hugeicons/react';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { DallEAPIWrapper } from '@langchain/openai';
import { z } from 'zod';

const dalleInputSchema = z.object({
  imageDescription: z.string(),
});

const dalleFunction = (context: ToolExecutionContext) => {
  const { apiKeys, updateToolExecutionState, preferences } = context;

  return new DynamicStructuredTool({
    name: 'image_generation',
    description: 'Useful for when you asked for image based on description.',
    schema: dalleInputSchema,
    func: async ({ imageDescription }, runManager) => {
      try {
        const tool = new DallEAPIWrapper({
          n: 1,
          model: 'dall-e-3',
          apiKey: apiKeys.openai,
          quality: preferences.dalleImageQuality,
          size: preferences.dalleImageSize,
        });

        const result = await tool.invoke(imageDescription);
        if (!result) {
          runManager?.handleToolError('Error performing Duckduck go search');
          throw new Error('Invalid response');
        }

        updateToolExecutionState({
          toolName: 'image_generation',
          executionArgs: {
            imageDescription,
          },
          renderData: {
            image: result,
            query: imageDescription,
          },
          executionResult: result,
          isLoading: false,
        });
        const searchPrompt = '';
        return searchPrompt;
      } catch (error) {
        updateToolExecutionState({
          toolName: 'image_generation',
          executionArgs: {
            imageDescription,
          },
          isLoading: false,
        });
        return 'Error performing search. Must not use duckduckgo_search tool now. Ask user to check API keys.';
      }
    },
  });
};

const dalleToolDefinition: ToolDefinition = {
  key: 'image_generation',
  description: 'Generate images',
  executionFunction: dalleFunction as any,
  displayName: 'Image Generation',
  isBeta: true,
  isVisibleInMenu: true,
  validateAvailability: async () => Promise.resolve(true),
  renderComponent: ({ image, query }) => {
    return <GeneratedImage image={image} />;
  },
  loadingMessage: 'Generating Image ...',
  successMessage: 'Generated Image',
  icon: AiImageIcon,
  compactIcon: AiImageIcon,
};

export { dalleToolDefinition };
